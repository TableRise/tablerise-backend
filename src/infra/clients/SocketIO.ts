/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Server as HttpServer } from 'http';
import { JwtPayload } from 'jsonwebtoken';
import { Namespace, Server, Socket } from 'socket.io';
import Campaign, { MatchData } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { rollDiceNotation } from 'src/domains/campaigns/helpers/DiceRoller';
import {
    buildCampaignSyncPayload,
    ensureBaseTokens,
    hydrateRealtimeCampaign,
    normalizeRealtimeMatchData,
    syncLegacyMapSelection,
} from 'src/domains/campaigns/helpers/RealtimeCampaignState';
import JWTGenerator from 'src/domains/users/helpers/JWTGenerator';
import newUUID from 'src/domains/common/helpers/newUUID';
import { MatchToken, RealtimeCampaign, SocketAck } from 'src/types/realtime';

type AckFn<T = unknown> = (response: SocketAck<T>) => void;

interface AuthenticatedSocket extends Socket {
    data: Socket['data'] & {
        user?: JwtPayload & { userId: string };
        campaignId?: string;
        role?: 'dungeon_master' | 'admin_player' | 'player';
    };
}

interface PresenceEntry {
    socketId: string;
    userId: string;
    role: 'dungeon_master' | 'admin_player' | 'player';
}

interface TokenUpdatePayload {
    campaignId: string;
    tokenId: string;
    xPct: number;
    yPct: number;
    widthPct: number;
}

type MatchStateField = Exclude<keyof RealtimeCampaign['matchData']['state'], 'tokens'>;
type MatchStatePatch = Partial<Pick<RealtimeCampaign['matchData']['state'], MatchStateField>>;

interface DirtyRealtimeSections {
    matchStateFields: Set<MatchStateField>;
    tokens: boolean;
    logs: boolean;
    confirmedPlayers: boolean;
    highlightedJournal: boolean;
}

interface DirtyRealtimeMutation {
    matchStateFields?: MatchStateField[];
    tokens?: boolean;
    logs?: boolean;
    confirmedPlayers?: boolean;
    highlightedJournal?: boolean;
}

interface ActiveCampaignEntry {
    campaign: RealtimeCampaign;
    dirty: DirtyRealtimeSections;
    flushing: boolean;
    flushingDirty: DirtyRealtimeSections | null;
    flushPromise: Promise<void> | null;
}

interface RealtimeStateUpdatePayload {
    matchStateFields?: MatchStatePatch;
    tokens?: RealtimeCampaign['matchData']['state']['tokens'];
    logs?: RealtimeCampaign['matchData']['logs'];
    confirmedPlayers?: RealtimeCampaign['matchData']['confirmedPlayers'];
    highlightedJournal?: RealtimeCampaign['infos']['highlightedJournal'];
}

const DM_ROLES: Array<'dungeon_master' | 'admin_player'> = ['dungeon_master', 'admin_player'];
const TOKEN_FLUSH_DEBOUNCE_MS = 500;
const createDirtyRealtimeSections = (): DirtyRealtimeSections => ({
    matchStateFields: new Set<MatchStateField>(),
    tokens: false,
    logs: false,
    confirmedPlayers: false,
    highlightedJournal: false,
});
const hasDirtyRealtimeSections = (dirty: DirtyRealtimeSections): boolean =>
    dirty.matchStateFields.size > 0 || dirty.tokens || dirty.logs || dirty.confirmedPlayers || dirty.highlightedJournal;
const cloneDirtyRealtimeSections = (dirty: DirtyRealtimeSections): DirtyRealtimeSections => ({
    matchStateFields: new Set<MatchStateField>(dirty.matchStateFields),
    tokens: dirty.tokens,
    logs: dirty.logs,
    confirmedPlayers: dirty.confirmedPlayers,
    highlightedJournal: dirty.highlightedJournal,
});
const mergeDirtyRealtimeSections = (
    target: DirtyRealtimeSections,
    source: DirtyRealtimeSections
): DirtyRealtimeSections => {
    source.matchStateFields.forEach((field) => target.matchStateFields.add(field));
    target.tokens = target.tokens || source.tokens;
    target.logs = target.logs || source.logs;
    target.confirmedPlayers = target.confirmedPlayers || source.confirmedPlayers;
    target.highlightedJournal = target.highlightedJournal || source.highlightedJournal;

    return target;
};

export default class SocketIO {
    private io: Server | null = null;
    private gameplayNamespace: Namespace | null = null;
    private readonly campaignsRepository;
    private readonly tokenForbidden;
    private readonly redisClient;
    private readonly logger;
    private readonly activeCampaignCache = new Map<string, ActiveCampaignEntry>();
    private readonly flushTimers = new Map<string, NodeJS.Timeout>();
    private readonly campaignPresence = new Map<string, Map<string, PresenceEntry>>();
    private readonly metrics = {
        scheduledFlushes: 0,
        executedFlushes: 0,
        flushFailures: 0,
        totalFlushDurationMs: 0,
        lastFlushDurationMs: 0,
        eventCounts: new Map<string, number>(),
    };

    constructor({ campaignsRepository, tokenForbidden, redisClient, logger }: any) {
        this.campaignsRepository = campaignsRepository;
        this.tokenForbidden = tokenForbidden;
        this.redisClient = redisClient;
        this.logger = logger;

        this.connect = this.connect.bind(this);
        this.emitToCampaign = this.emitToCampaign.bind(this);
        this.syncActiveCampaign = this.syncActiveCampaign.bind(this);
        this.getMetricsSnapshot = this.getMetricsSnapshot.bind(this);
    }

    public async connect(httpServer: HttpServer): Promise<void> {
        this.logger('info', 'Connect - SocketIO', true);

        this.io = new Server(httpServer, {
            cors: {
                origin: process.env.CORS_ORIGIN ?? '*',
                credentials: true,
            },
        });

        await this.initializeRedisAdapter();

        this.gameplayNamespace = this.io.of('/campaigns');
        this.gameplayNamespace.use(async (socket, next) => {
            try {
                const authenticatedSocket = socket as AuthenticatedSocket;
                authenticatedSocket.data.user = await this.authenticateSocket(authenticatedSocket);
                next();
            } catch (error) {
                next(error as Error);
            }
        });

        this.gameplayNamespace.on('connection', (socket) => {
            const authenticatedSocket = socket as AuthenticatedSocket;

            authenticatedSocket.on('campaign:join', (payload, ack) => {
                this.trackEvent('campaign:join');
                void this.runWithAck(authenticatedSocket, ack, async () => {
                    await this.joinCampaign(authenticatedSocket, payload);
                });
            });

            authenticatedSocket.on('match:set_map', (payload, ack) => {
                this.trackEvent('match:set_map');
                void this.runWithAck(authenticatedSocket, ack, async () => {
                    const updatedCampaign = await this.requireDungeonMasterMutation(
                        authenticatedSocket,
                        payload.campaignId,
                        (campaign) => {
                            if (payload.mapId !== null) {
                                const mapExists = campaign.matchData.mapImages.some(
                                    (mapImage) => mapImage.id === payload.mapId
                                );
                                if (!mapExists) HttpRequestErrors.throwError('content-inexistent');
                            }

                            campaign.matchData.state.activeMapId = payload.mapId;
                            return campaign;
                        },
                        { matchStateFields: ['activeMapId'] }
                    );

                    this.emitToCampaign(payload.campaignId, 'match:map_changed', {
                        campaignId: payload.campaignId,
                        activeMap:
                            updatedCampaign.matchData.mapImages.find(
                                (mapImage) => mapImage.id === updatedCampaign.matchData.state.activeMapId
                            )?.link ?? null,
                    });
                });
            });

            authenticatedSocket.on('match:set_grid', (payload, ack) => {
                this.trackEvent('match:set_grid');
                void this.runWithAck(authenticatedSocket, ack, async () => {
                    await this.requireDungeonMasterMutation(
                        authenticatedSocket,
                        payload.campaignId,
                        (campaign) => {
                            campaign.matchData.state.gridVisible = payload.gridVisible;
                            return campaign;
                        },
                        { matchStateFields: ['gridVisible'] }
                    );

                    this.emitToCampaign(payload.campaignId, 'match:grid_changed', {
                        campaignId: payload.campaignId,
                        gridVisible: payload.gridVisible,
                    });
                });
            });

            authenticatedSocket.on('match:set_effect', (payload, ack) => {
                this.trackEvent('match:set_effect');
                void this.runWithAck(authenticatedSocket, ack, async () => {
                    await this.requireDungeonMasterMutation(
                        authenticatedSocket,
                        payload.campaignId,
                        (campaign) => {
                            campaign.matchData.state.activeEffect = payload.activeEffect;
                            return campaign;
                        },
                        { matchStateFields: ['activeEffect'] }
                    );

                    this.emitToCampaign(payload.campaignId, 'match:effect_changed', {
                        campaignId: payload.campaignId,
                        activeEffect: payload.activeEffect,
                    });
                });
            });

            authenticatedSocket.on('match:set_music', (payload, ack) => {
                this.trackEvent('match:set_music');
                void this.runWithAck(authenticatedSocket, ack, async () => {
                    await this.requireDungeonMasterMutation(
                        authenticatedSocket,
                        payload.campaignId,
                        (campaign) => {
                            if (payload.playingMusicId !== null) {
                                const musicExists = campaign.musics.some(
                                    (music) => music.id === payload.playingMusicId
                                );
                                if (!musicExists) HttpRequestErrors.throwError('content-inexistent');
                            }

                            campaign.matchData.state.playingMusicId = payload.playingMusicId;
                            return campaign;
                        },
                        { matchStateFields: ['playingMusicId'] }
                    );

                    this.emitToCampaign(payload.campaignId, 'match:music_changed', {
                        campaignId: payload.campaignId,
                        playingMusicId: payload.playingMusicId,
                    });
                });
            });

            authenticatedSocket.on('match:set_visible_characters', (payload, ack) => {
                this.trackEvent('match:set_visible_characters');
                void this.runWithAck(authenticatedSocket, ack, async () => {
                    await this.requireDungeonMasterMutation(
                        authenticatedSocket,
                        payload.campaignId,
                        (campaign) => {
                            const allowedCharacterIds = new Set(
                                campaign.campaignPlayers.flatMap((player) => player.characterIds)
                            );
                            campaign.matchData.state.visibleCharacterIds = payload.visibleCharacterIds.filter(
                                (characterId: string) => allowedCharacterIds.has(characterId)
                            );
                            return campaign;
                        },
                        { matchStateFields: ['visibleCharacterIds'] }
                    );

                    this.emitToCampaign(payload.campaignId, 'match:visible_characters_changed', {
                        campaignId: payload.campaignId,
                        visibleCharacterIds: payload.visibleCharacterIds,
                    });
                });
            });

            authenticatedSocket.on('token:create_clone', (payload, ack) => {
                this.trackEvent('token:create_clone');
                void this.runWithAck(authenticatedSocket, ack, async () => {
                    let createdCloneToken: MatchToken | null = null;

                    await this.requireDungeonMasterMutation(
                        authenticatedSocket,
                        payload.campaignId,
                        (campaign) => {
                            const now = new Date().toISOString();
                            createdCloneToken = {
                                tokenId: `clone:${newUUID()}`,
                                characterId: payload.characterId,
                                isClone: true,
                                xPct: payload.xPct,
                                yPct: payload.yPct,
                                widthPct: payload.widthPct,
                                createdBy: authenticatedSocket.data.user?.userId as string,
                                updatedBy: authenticatedSocket.data.user?.userId as string,
                                createdAt: now,
                                updatedAt: now,
                            };

                            campaign.matchData.state.tokens.push(createdCloneToken);
                            return campaign;
                        },
                        { tokens: true }
                    );

                    this.emitToCampaign(payload.campaignId, 'token:clone_created', createdCloneToken);
                });
            });

            authenticatedSocket.on('token:update', (payload, ack) => {
                this.trackEvent('token:update');
                void this.runWithAck(authenticatedSocket, ack, async () => {
                    const updatedToken = await this.updateToken(authenticatedSocket, payload);
                    this.emitToCampaign(payload.campaignId, 'token:updated', updatedToken);
                });
            });

            authenticatedSocket.on('token:batch_update', (payload, ack) => {
                this.trackEvent('token:batch_update');
                void this.runWithAck(authenticatedSocket, ack, async () => {
                    const updatedTokens = await this.updateTokensBatch(
                        authenticatedSocket,
                        payload.campaignId,
                        payload.updates
                    );
                    this.emitToCampaign(payload.campaignId, 'token:batch_updated', {
                        campaignId: payload.campaignId,
                        updates: updatedTokens,
                    });
                });
            });

            authenticatedSocket.on('token:delete', (payload, ack) => {
                this.trackEvent('token:delete');
                void this.runWithAck(authenticatedSocket, ack, async () => {
                    await this.requireDungeonMasterMutation(
                        authenticatedSocket,
                        payload.campaignId,
                        (campaign) => {
                            const tokenToDelete = campaign.matchData.state.tokens.find(
                                (token) => token.tokenId === payload.tokenId
                            );
                            if (!tokenToDelete?.isClone) HttpRequestErrors.throwError('content-inexistent');

                            campaign.matchData.state.tokens = campaign.matchData.state.tokens.filter(
                                (token) => token.tokenId !== payload.tokenId
                            );
                            return campaign;
                        },
                        { tokens: true }
                    );

                    this.emitToCampaign(payload.campaignId, 'token:deleted', {
                        campaignId: payload.campaignId,
                        tokenId: payload.tokenId,
                    });
                });
            });

            authenticatedSocket.on('dice:roll_requested', (payload, ack) => {
                this.trackEvent('dice:roll_requested');
                void this.runWithAck(authenticatedSocket, ack, async () => {
                    const campaign = await this.getActiveCampaign(payload.campaignId);
                    this.assertSocketJoinedCampaign(authenticatedSocket, payload.campaignId);

                    const rollResult = rollDiceNotation(payload.notation);
                    campaign.matchData.logs.push({
                        loggedAt: new Date().toISOString(),
                        content: `[${authenticatedSocket.data.user?.userId}] rolled ${payload.notation} = ${rollResult.total}`,
                    });

                    const activeEntry = this.getActiveCampaignEntry(payload.campaignId);
                    if (activeEntry) {
                        activeEntry.campaign = campaign;
                        this.markActiveCampaignDirty(activeEntry, { logs: true });
                    }

                    this.scheduleStatePersist(payload.campaignId);

                    const resolvedPayload = {
                        rollId: rollResult.rollId,
                        campaignId: payload.campaignId,
                        userId: authenticatedSocket.data.user?.userId,
                        characterId: payload.characterId,
                        notation: payload.notation,
                        label: payload.label,
                        rolls: rollResult.rolls,
                        total: rollResult.total,
                        visibility: payload.visibility,
                    };

                    this.emitToCampaign(payload.campaignId, 'dice:roll_resolved', resolvedPayload);
                });
            });

            authenticatedSocket.on('disconnect', () => {
                this.trackEvent('disconnect');
                void this.handleDisconnect(authenticatedSocket);
            });
        });
    }

    public emitToCampaign(campaignId: string, eventName: string, payload: unknown): void {
        if (!this.gameplayNamespace) return;
        this.gameplayNamespace.to(this.getCampaignRoom(campaignId)).emit(eventName, payload);
    }

    public syncActiveCampaign(campaign: Campaign): void {
        if (!campaign.campaignId) return;

        const activeEntry = this.activeCampaignCache.get(campaign.campaignId);
        if (!activeEntry) return;

        activeEntry.campaign = this.mergeCampaignWithDirtyState(
            campaign,
            activeEntry.campaign,
            this.getDirtySectionsToPreserve(activeEntry)
        );
    }

    public getMetricsSnapshot(): {
        connectedSockets: number;
        activeCampaigns: number;
        scheduledFlushes: number;
        executedFlushes: number;
        flushFailures: number;
        lastFlushDurationMs: number;
        averageFlushDurationMs: number;
        eventCounts: Record<string, number>;
    } {
        return {
            connectedSockets: this.gameplayNamespace?.sockets.size ?? 0,
            activeCampaigns: this.activeCampaignCache.size,
            scheduledFlushes: this.metrics.scheduledFlushes,
            executedFlushes: this.metrics.executedFlushes,
            flushFailures: this.metrics.flushFailures,
            lastFlushDurationMs: this.metrics.lastFlushDurationMs,
            averageFlushDurationMs:
                this.metrics.executedFlushes > 0 ? this.metrics.totalFlushDurationMs / this.metrics.executedFlushes : 0,
            eventCounts: Object.fromEntries(this.metrics.eventCounts),
        };
    }

    private getCampaignRoom(campaignId: string): string {
        return `campaign:${campaignId}`;
    }

    private async authenticateSocket(socket: AuthenticatedSocket): Promise<JwtPayload & { userId: string }> {
        const cookieHeader = socket.handshake.headers.cookie;
        const token = cookieHeader
            ?.split(';')
            .map((cookie) => cookie.trim())
            .find((cookie) => cookie.startsWith('token='))
            ?.slice('token='.length);

        if (!token) HttpRequestErrors.throwError('unauthorized');

        const isTokenForbidden = await this.tokenForbidden.verifyForbiddenToken(token);
        if (isTokenForbidden) HttpRequestErrors.throwError('unauthorized');

        const payload = JWTGenerator.verify(decodeURIComponent(token));
        if (!payload || typeof payload !== 'object' || !('userId' in payload))
            HttpRequestErrors.throwError('unauthorized');

        return payload as JwtPayload & { userId: string };
    }

    private async runWithAck(
        socket: AuthenticatedSocket,
        ack: AckFn | undefined,
        handler: () => Promise<void>
    ): Promise<void> {
        try {
            await handler();
            ack?.({ ok: true });
        } catch (error) {
            this.logger('error', `Socket.IO handler failed: ${String(error)}`, true);
            const ackError = this.mapErrorToAck(error);
            ack?.(ackError);
            if (!ackError.ok) {
                socket.emit('campaign:error', ackError.error);
            }
        }
    }

    private mapErrorToAck(error: unknown): SocketAck {
        if (error instanceof HttpRequestErrors) {
            return {
                ok: false,
                error: {
                    code: error.name || 'request_error',
                    message: error.message,
                },
            };
        }

        return {
            ok: false,
            error: {
                code: 'internal_error',
                message: error instanceof Error ? error.message : 'Unexpected socket error',
            },
        };
    }

    private async joinCampaign(socket: AuthenticatedSocket, payload: { campaignId: string }): Promise<void> {
        const campaign = await this.getActiveCampaign(payload.campaignId);
        const player = campaign.campaignPlayers.find((entry) => entry.userId === socket.data.user?.userId);

        if (!player) HttpRequestErrors.throwError('campaign-player-not-exists');

        if (socket.data.campaignId && socket.data.campaignId !== payload.campaignId) {
            const previousCampaignId = socket.data.campaignId;
            await socket.leave(this.getCampaignRoom(previousCampaignId));
            await this.detachSocketFromCampaign(previousCampaignId, socket.id);
        }

        socket.data.campaignId = payload.campaignId;
        socket.data.role = player.role;

        await socket.join(this.getCampaignRoom(payload.campaignId));

        const shouldBroadcastJoin = this.addPresence(payload.campaignId, {
            socketId: socket.id,
            userId: socket.data.user?.userId as string,
            role: player.role,
        });

        socket.emit('campaign:sync', buildCampaignSyncPayload(campaign, this.listConnectedUsers(payload.campaignId)));

        if (shouldBroadcastJoin) {
            socket.to(this.getCampaignRoom(payload.campaignId)).emit('presence:user_joined', {
                campaignId: payload.campaignId,
                userId: socket.data.user?.userId,
                role: player.role,
            });
        }
    }

    private async loadCampaignIntoCache(campaignId: string): Promise<RealtimeCampaign> {
        const campaign = hydrateRealtimeCampaign(await this.campaignsRepository.findOne({ campaignId }));
        this.activeCampaignCache.set(campaignId, {
            campaign,
            dirty: createDirtyRealtimeSections(),
            flushing: false,
            flushingDirty: null,
            flushPromise: null,
        });

        return campaign;
    }

    private async getActiveCampaign(campaignId: string): Promise<RealtimeCampaign> {
        const activeEntry = this.activeCampaignCache.get(campaignId);
        if (activeEntry) return activeEntry.campaign;

        return this.loadCampaignIntoCache(campaignId);
    }

    private getActiveCampaignEntry(campaignId: string): ActiveCampaignEntry | null {
        return this.activeCampaignCache.get(campaignId) ?? null;
    }

    private async requireDungeonMasterMutation(
        socket: AuthenticatedSocket,
        campaignId: string,
        mutator: (campaign: RealtimeCampaign) => RealtimeCampaign,
        dirtySections: DirtyRealtimeMutation
    ): Promise<RealtimeCampaign> {
        this.assertSocketJoinedCampaign(socket, campaignId);

        if (!this.hasDungeonMasterPrivileges(socket.data.role)) {
            HttpRequestErrors.throwError('forbidden-role-operation');
        }

        const campaign = ensureBaseTokens(mutator(await this.getActiveCampaign(campaignId)));
        const activeEntry = this.getActiveCampaignEntry(campaignId);
        if (activeEntry) {
            activeEntry.campaign = campaign;
            this.markActiveCampaignDirty(activeEntry, dirtySections);
        }

        this.scheduleStatePersist(campaignId);

        return campaign;
    }

    private assertSocketJoinedCampaign(socket: AuthenticatedSocket, campaignId: string): void {
        if (socket.data.campaignId !== campaignId) {
            HttpRequestErrors.throwError('unauthorized');
        }
    }

    private listConnectedUsers(
        campaignId: string
    ): Array<{ userId: string; role: 'dungeon_master' | 'admin_player' | 'player' }> {
        const socketPresence = this.campaignPresence.get(campaignId);
        if (!socketPresence) return [];

        const uniqueUsers = new Map<string, { userId: string; role: 'dungeon_master' | 'admin_player' | 'player' }>();
        socketPresence.forEach((presence) => {
            uniqueUsers.set(presence.userId, {
                userId: presence.userId,
                role: presence.role,
            });
        });

        return [...uniqueUsers.values()];
    }

    private addPresence(campaignId: string, presence: PresenceEntry): boolean {
        const roomPresence = this.campaignPresence.get(campaignId) ?? new Map<string, PresenceEntry>();
        const hadUserConnected = [...roomPresence.values()].some((entry) => entry.userId === presence.userId);

        roomPresence.set(presence.socketId, presence);
        this.campaignPresence.set(campaignId, roomPresence);

        return !hadUserConnected;
    }

    private removePresence(campaignId: string, socketId: string): PresenceEntry | null {
        const roomPresence = this.campaignPresence.get(campaignId);
        if (!roomPresence) return null;

        const entry = roomPresence.get(socketId) ?? null;
        if (!entry) return null;

        roomPresence.delete(socketId);

        if (!roomPresence.size) {
            this.campaignPresence.delete(campaignId);
        }

        return entry;
    }

    private async handleDisconnect(socket: AuthenticatedSocket): Promise<void> {
        const campaignId = socket.data.campaignId;
        if (!campaignId) return;

        await this.detachSocketFromCampaign(campaignId, socket.id);
    }

    private async updateToken(socket: AuthenticatedSocket, payload: TokenUpdatePayload): Promise<MatchToken> {
        this.assertSocketJoinedCampaign(socket, payload.campaignId);

        const campaign = await this.getActiveCampaign(payload.campaignId);
        const tokenIndex = campaign.matchData.state.tokens.findIndex((token) => token.tokenId === payload.tokenId);
        if (tokenIndex === -1) HttpRequestErrors.throwError('content-inexistent');

        this.assertCanMutateToken(socket, campaign, campaign.matchData.state.tokens[tokenIndex]);

        const updatedToken: MatchToken = {
            ...campaign.matchData.state.tokens[tokenIndex],
            xPct: payload.xPct,
            yPct: payload.yPct,
            widthPct: payload.widthPct,
            updatedBy: socket.data.user?.userId as string,
            updatedAt: new Date().toISOString(),
        };

        campaign.matchData.state.tokens[tokenIndex] = updatedToken;
        const activeEntry = this.getActiveCampaignEntry(payload.campaignId);
        if (activeEntry) {
            activeEntry.campaign = campaign;
            this.markActiveCampaignDirty(activeEntry, { tokens: true });
        }

        this.scheduleStatePersist(payload.campaignId);

        return updatedToken;
    }

    private async updateTokensBatch(
        socket: AuthenticatedSocket,
        campaignId: string,
        updates: TokenUpdatePayload[]
    ): Promise<MatchToken[]> {
        this.assertSocketJoinedCampaign(socket, campaignId);

        const campaign = await this.getActiveCampaign(campaignId);
        const updatedTokens: MatchToken[] = [];

        updates.forEach((update) => {
            const tokenIndex = campaign.matchData.state.tokens.findIndex((token) => token.tokenId === update.tokenId);
            if (tokenIndex === -1) HttpRequestErrors.throwError('content-inexistent');

            this.assertCanMutateToken(socket, campaign, campaign.matchData.state.tokens[tokenIndex]);

            const updatedToken: MatchToken = {
                ...campaign.matchData.state.tokens[tokenIndex],
                xPct: update.xPct,
                yPct: update.yPct,
                widthPct: update.widthPct,
                updatedBy: socket.data.user?.userId as string,
                updatedAt: new Date().toISOString(),
            };

            campaign.matchData.state.tokens[tokenIndex] = updatedToken;
            updatedTokens.push(updatedToken);
        });

        const activeEntry = this.getActiveCampaignEntry(campaignId);
        if (activeEntry) {
            activeEntry.campaign = campaign;
            this.markActiveCampaignDirty(activeEntry, { tokens: true });
        }

        this.scheduleStatePersist(campaignId);

        return updatedTokens;
    }

    private assertCanMutateToken(socket: AuthenticatedSocket, campaign: RealtimeCampaign, token: MatchToken): void {
        if (this.hasDungeonMasterPrivileges(socket.data.role)) return;

        const player = campaign.campaignPlayers.find((entry) => entry.userId === socket.data.user?.userId);
        if (!player?.characterIds.includes(token.characterId)) {
            HttpRequestErrors.throwError('forbidden-role-operation');
        }
    }

    private hasDungeonMasterPrivileges(
        role: AuthenticatedSocket['data']['role']
    ): role is 'dungeon_master' | 'admin_player' {
        return role !== undefined && DM_ROLES.includes(role);
    }

    private scheduleStatePersist(campaignId: string): void {
        const pendingFlush = this.flushTimers.get(campaignId);
        if (pendingFlush) clearTimeout(pendingFlush);

        this.metrics.scheduledFlushes += 1;

        const timeout = setTimeout(() => {
            void this.persistCampaignState(campaignId).finally(() => {
                if (this.flushTimers.get(campaignId) === timeout) {
                    this.flushTimers.delete(campaignId);
                }
            });
        }, TOKEN_FLUSH_DEBOUNCE_MS);

        this.flushTimers.set(campaignId, timeout);
    }

    private async persistCampaignState(campaignId: string): Promise<void> {
        const activeEntry = this.getActiveCampaignEntry(campaignId);
        if (!activeEntry) return;
        if (activeEntry.flushing) {
            await activeEntry.flushPromise;
            return;
        }
        if (!hasDirtyRealtimeSections(activeEntry.dirty)) return;

        const dirtySnapshot = cloneDirtyRealtimeSections(activeEntry.dirty);
        activeEntry.dirty = createDirtyRealtimeSections();
        activeEntry.flushing = true;
        activeEntry.flushingDirty = dirtySnapshot;

        const flushStartedAt = Date.now();
        this.metrics.executedFlushes += 1;

        const flushPromise = (async () => {
            try {
                syncLegacyMapSelection(activeEntry.campaign);
                activeEntry.campaign.matchData = normalizeRealtimeMatchData(
                    activeEntry.campaign.matchData as MatchData
                );

                const savedCampaign = await this.campaignsRepository.updateRealtimeState(
                    campaignId,
                    this.buildRealtimeStateUpdatePayload(activeEntry.campaign, dirtySnapshot)
                );

                activeEntry.campaign = this.mergeCampaignWithDirtyState(
                    savedCampaign,
                    activeEntry.campaign,
                    this.getDirtySectionsToPreserve(activeEntry)
                );
            } catch (error) {
                this.metrics.flushFailures += 1;
                mergeDirtyRealtimeSections(activeEntry.dirty, dirtySnapshot);
                throw error;
            } finally {
                activeEntry.flushing = false;
                activeEntry.flushingDirty = null;
                activeEntry.flushPromise = null;

                const flushDurationMs = Date.now() - flushStartedAt;
                this.metrics.lastFlushDurationMs = flushDurationMs;
                this.metrics.totalFlushDurationMs += flushDurationMs;

                if (hasDirtyRealtimeSections(activeEntry.dirty)) {
                    this.scheduleStatePersist(campaignId);
                }
            }
        })();

        activeEntry.flushPromise = flushPromise;
        await flushPromise;
    }

    private buildRealtimeStateUpdatePayload(
        campaign: RealtimeCampaign,
        dirtySections: DirtyRealtimeSections
    ): RealtimeStateUpdatePayload {
        const payload: RealtimeStateUpdatePayload = {};

        if (dirtySections.matchStateFields.size) {
            const matchStateFields: MatchStatePatch = {};
            dirtySections.matchStateFields.forEach((field) => {
                matchStateFields[field] = campaign.matchData.state[field];
            });
            payload.matchStateFields = matchStateFields;
        }

        if (dirtySections.tokens) payload.tokens = campaign.matchData.state.tokens;
        if (dirtySections.logs) payload.logs = campaign.matchData.logs;
        if (dirtySections.confirmedPlayers) payload.confirmedPlayers = campaign.matchData.confirmedPlayers;
        if (dirtySections.highlightedJournal) payload.highlightedJournal = campaign.infos.highlightedJournal;

        return payload;
    }

    private markActiveCampaignDirty(activeEntry: ActiveCampaignEntry, dirtySections: DirtyRealtimeMutation): void {
        if (dirtySections.matchStateFields?.length) {
            dirtySections.matchStateFields.forEach((field) => {
                activeEntry.dirty.matchStateFields.add(field);
            });
        }

        activeEntry.dirty.tokens = activeEntry.dirty.tokens || Boolean(dirtySections.tokens);
        activeEntry.dirty.logs = activeEntry.dirty.logs || Boolean(dirtySections.logs);
        activeEntry.dirty.confirmedPlayers =
            activeEntry.dirty.confirmedPlayers || Boolean(dirtySections.confirmedPlayers);
        activeEntry.dirty.highlightedJournal =
            activeEntry.dirty.highlightedJournal || Boolean(dirtySections.highlightedJournal);
    }

    private getDirtySectionsToPreserve(activeEntry: ActiveCampaignEntry): DirtyRealtimeSections {
        const dirtySections = cloneDirtyRealtimeSections(activeEntry.dirty);

        if (activeEntry.flushingDirty) {
            mergeDirtyRealtimeSections(dirtySections, activeEntry.flushingDirty);
        }

        return dirtySections;
    }

    private mergeCampaignWithDirtyState(
        persistedCampaign: Campaign,
        cachedCampaign: RealtimeCampaign,
        dirtySections: DirtyRealtimeSections
    ): RealtimeCampaign {
        const mergedCampaign = ensureBaseTokens(hydrateRealtimeCampaign(persistedCampaign));

        dirtySections.matchStateFields.forEach((field) => {
            mergedCampaign.matchData.state[field] = cachedCampaign.matchData.state[field];
        });

        if (dirtySections.tokens) mergedCampaign.matchData.state.tokens = cachedCampaign.matchData.state.tokens;
        if (dirtySections.logs) mergedCampaign.matchData.logs = cachedCampaign.matchData.logs;
        if (dirtySections.confirmedPlayers)
            mergedCampaign.matchData.confirmedPlayers = cachedCampaign.matchData.confirmedPlayers;
        if (dirtySections.highlightedJournal)
            mergedCampaign.infos.highlightedJournal = cachedCampaign.infos.highlightedJournal;

        return ensureBaseTokens(mergedCampaign);
    }

    private async detachSocketFromCampaign(campaignId: string, socketId: string): Promise<void> {
        const removedPresence = this.removePresence(campaignId, socketId);
        if (!removedPresence) return;

        const userStillConnected = this.listConnectedUsers(campaignId).some(
            (presence) => presence.userId === removedPresence.userId
        );

        if (!userStillConnected) {
            this.emitToCampaign(campaignId, 'presence:user_left', {
                campaignId,
                userId: removedPresence.userId,
                role: removedPresence.role,
            });
        }

        if (!this.listConnectedUsers(campaignId).length) {
            this.clearScheduledFlush(campaignId);
            await this.persistCampaignState(campaignId);
            this.activeCampaignCache.delete(campaignId);
        }
    }

    private clearScheduledFlush(campaignId: string): void {
        const pendingFlush = this.flushTimers.get(campaignId);
        if (!pendingFlush) return;

        clearTimeout(pendingFlush);
        this.flushTimers.delete(campaignId);
    }

    private trackEvent(eventName: string): void {
        const currentCount = this.metrics.eventCounts.get(eventName) ?? 0;
        this.metrics.eventCounts.set(eventName, currentCount + 1);
    }

    private async initializeRedisAdapter(): Promise<void> {
        if (!this.io || !this.redisClient || typeof this.redisClient.duplicate !== 'function') return;

        try {
            const { createAdapter } = require('@socket.io/redis-adapter') as {
                createAdapter: (publisher: any, subscriber: any) => any;
            };
            const redisSubscriber = this.redisClient.duplicate();

            if (typeof redisSubscriber.connect === 'function' && !redisSubscriber.isOpen) {
                await redisSubscriber.connect();
            }

            this.io.adapter(createAdapter(this.redisClient, redisSubscriber));
            this.logger('info', 'Socket.IO Redis adapter initialized', true);
        } catch (error) {
            this.logger('warn', `Socket.IO Redis adapter unavailable: ${String(error)}`, true);
        }
    }
}
