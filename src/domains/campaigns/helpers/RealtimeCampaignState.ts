import Campaign, { Journal, Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import newUUID from 'src/domains/common/helpers/newUUID';
import {
    CampaignSyncPayload,
    ConnectedUserPresence,
    MatchToken,
    RealtimeCampaign,
    RealtimeMatchData,
} from 'src/types/realtime';

const DEFAULT_TOKEN_X = 10;
const DEFAULT_TOKEN_Y = 10;
const DEFAULT_TOKEN_WIDTH = 6;

const isImageObject = (value: unknown): value is ImageObject =>
    typeof value === 'object' && value !== null && 'id' in value && 'link' in value;

const isJournal = (value: unknown): value is Journal =>
    typeof value === 'object' && value !== null && 'title' in value && 'content' in value;

export const createDefaultMatchState = () => ({
    activeMapId: null,
    gridVisible: true,
    activeEffect: null,
    playingMusicId: null,
    visibleCharacterIds: [],
    tokens: [],
});

export const createBaseToken = (characterId: string, userId: string, now: string): MatchToken => ({
    tokenId: `base:${characterId}`,
    characterId,
    isClone: false,
    xPct: DEFAULT_TOKEN_X,
    yPct: DEFAULT_TOKEN_Y,
    widthPct: DEFAULT_TOKEN_WIDTH,
    createdBy: userId,
    updatedBy: userId,
    createdAt: now,
    updatedAt: now,
});

const uniquePlayers = (players: Player[]): Player[] => {
    const seen = new Set<string>();

    return players.filter((player) => {
        if (seen.has(player.userId)) return false;
        seen.add(player.userId);
        return true;
    });
};

export const normalizeRealtimeMatchData = (matchData: Campaign['matchData'] | null | undefined): RealtimeMatchData => {
    const legacyMatchData = (matchData ?? {}) as Record<string, any>;
    const actualMapImage = isImageObject(legacyMatchData.actualMapImage) ? legacyMatchData.actualMapImage : undefined;
    const imageHighlighted = isImageObject(legacyMatchData.imageHighlighted) ? legacyMatchData.imageHighlighted : null;

    const normalized: RealtimeMatchData = {
        matchId: typeof legacyMatchData.matchId === 'string' ? legacyMatchData.matchId : newUUID(),
        prevDate: typeof legacyMatchData.prevDate === 'string' ? legacyMatchData.prevDate : 'no-date',
        nextSessionResume:
            typeof legacyMatchData.nextSessionResume === 'string' ? legacyMatchData.nextSessionResume : undefined,
        confirmedPlayers: uniquePlayers(
            Array.isArray(legacyMatchData.confirmedPlayers) ? legacyMatchData.confirmedPlayers : []
        ),
        mapImages: Array.isArray(legacyMatchData.mapImages) ? legacyMatchData.mapImages : [],
        images: Array.isArray(legacyMatchData.images) ? legacyMatchData.images : [],
        imageHighlighted,
        logs: Array.isArray(legacyMatchData.logs) ? legacyMatchData.logs : [],
        state: {
            ...createDefaultMatchState(),
            ...(typeof legacyMatchData.state === 'object' && legacyMatchData.state !== null
                ? legacyMatchData.state
                : {}),
            activeMapId:
                typeof legacyMatchData.state?.activeMapId === 'string'
                    ? legacyMatchData.state.activeMapId
                    : actualMapImage?.id ?? null,
            visibleCharacterIds: Array.isArray(legacyMatchData.state?.visibleCharacterIds)
                ? legacyMatchData.state.visibleCharacterIds
                : [],
            tokens: Array.isArray(legacyMatchData.state?.tokens) ? legacyMatchData.state.tokens : [],
        },
        characters: Array.isArray(legacyMatchData.characters) ? legacyMatchData.characters : [],
        charactersInGame: Array.isArray(legacyMatchData.charactersInGame) ? legacyMatchData.charactersInGame : [],
        musics: Array.isArray(legacyMatchData.musics) ? legacyMatchData.musics : [],
        actualMapImage,
    };

    return normalized;
};

export const ensureBaseTokens = (campaign: RealtimeCampaign): RealtimeCampaign => {
    const now = new Date().toISOString();
    const playerByCharacterId = new Map<string, string>();

    campaign.campaignPlayers.forEach((player) => {
        player.characterIds.forEach((characterId) => playerByCharacterId.set(characterId, player.userId));
    });

    const persistedTokens = campaign.matchData.state.tokens.filter((token) => {
        if (token.isClone) return true;
        return playerByCharacterId.has(token.characterId);
    });

    const baseTokenByCharacterId = new Map(
        persistedTokens.filter((token) => !token.isClone).map((token) => [token.characterId, token])
    );

    playerByCharacterId.forEach((userId, characterId) => {
        if (!baseTokenByCharacterId.has(characterId)) {
            persistedTokens.push(createBaseToken(characterId, userId, now));
        }
    });

    campaign.matchData.state.tokens = persistedTokens;
    campaign.matchData.state.visibleCharacterIds = campaign.matchData.state.visibleCharacterIds.filter((characterId) =>
        playerByCharacterId.has(characterId)
    );

    return campaign;
};

export const hydrateRealtimeCampaign = (campaign: Campaign): RealtimeCampaign => {
    const realtimeCampaign = {
        ...campaign,
        matchData: normalizeRealtimeMatchData(campaign.matchData),
    } as RealtimeCampaign;

    return ensureBaseTokens(realtimeCampaign);
};

export const resolveActiveMap = (campaign: RealtimeCampaign): ImageObject | null =>
    campaign.matchData.mapImages.find((mapImage) => mapImage.id === campaign.matchData.state.activeMapId) ?? null;

export const normalizeHighlightedJournal = (
    highlightedJournal: Campaign['infos']['highlightedJournal']
): Journal | null => {
    if (!isJournal(highlightedJournal)) return null;
    return highlightedJournal;
};

export const buildConfirmedPlayersPresence = (players: Player[]): ConnectedUserPresence[] =>
    players.map((player) => ({
        userId: player.userId,
        role: player.role,
    }));

export const buildCampaignSyncPayload = (
    campaign: RealtimeCampaign,
    connectedUsers: ConnectedUserPresence[]
): CampaignSyncPayload => ({
    campaignId: campaign.campaignId as string,
    serverTime: new Date().toISOString(),
    presence: {
        connectedUsers,
        confirmedPlayers: buildConfirmedPlayersPresence(campaign.matchData.confirmedPlayers),
    },
    match: {
        activeMap: resolveActiveMap(campaign)?.link ?? null,
        gridVisible: campaign.matchData.state.gridVisible,
        activeEffect: campaign.matchData.state.activeEffect,
        playingMusicId: campaign.matchData.state.playingMusicId,
        visibleCharacterIds: campaign.matchData.state.visibleCharacterIds,
        tokens: campaign.matchData.state.tokens,
        images: campaign.matchData.images,
        imageHighlighted: campaign.matchData.imageHighlighted,
        highlightedJournalPost: normalizeHighlightedJournal(campaign.infos.highlightedJournal),
    },
});

export const syncLegacyMapSelection = (campaign: RealtimeCampaign): RealtimeCampaign => {
    const activeMap = resolveActiveMap(campaign);
    campaign.matchData.actualMapImage = activeMap ?? undefined;
    return campaign;
};
