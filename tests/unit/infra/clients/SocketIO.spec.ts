import sinon from 'sinon';
import SocketIO from 'src/infra/clients/SocketIO';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

const Module = require('module');

const clone = <T>(payload: T): T => JSON.parse(JSON.stringify(payload)) as T;

const applyRealtimeStateUpdate = (campaign: any, payload: any): any => {
    const updatedCampaign = clone(campaign);
    updatedCampaign.matchData = updatedCampaign.matchData ?? {};
    updatedCampaign.matchData.state = updatedCampaign.matchData.state ?? {};
    updatedCampaign.matchData.logs = updatedCampaign.matchData.logs ?? [];
    updatedCampaign.matchData.confirmedPlayers = updatedCampaign.matchData.confirmedPlayers ?? [];
    updatedCampaign.infos = updatedCampaign.infos ?? {};

    if (payload.matchStateFields) {
        Object.assign(updatedCampaign.matchData.state, payload.matchStateFields);
    }

    if (payload.tokens !== undefined) updatedCampaign.matchData.state.tokens = clone(payload.tokens);
    if (payload.logs !== undefined) updatedCampaign.matchData.logs = clone(payload.logs);
    if (payload.confirmedPlayers !== undefined)
        updatedCampaign.matchData.confirmedPlayers = clone(payload.confirmedPlayers);
    if (payload.highlightedJournal !== undefined)
        updatedCampaign.infos.highlightedJournal = clone(payload.highlightedJournal);

    return updatedCampaign;
};

describe('Infra :: Clients :: SocketIO', () => {
    const logger = (): void => {};
    const tokenForbidden = {
        verifyForbiddenToken: sinon.stub().resolves(false),
    };

    const buildCampaignRepository = (initialCampaign: any) => {
        let persistedCampaign = clone(initialCampaign);

        return {
            findOne: sinon.stub().callsFake(async () => clone(persistedCampaign)),
            update: sinon.stub().callsFake(async ({ payload }) => {
                persistedCampaign = clone(payload);
                return clone(persistedCampaign);
            }),
            updateRealtimeState: sinon.stub().callsFake(async (_campaignId: string, payload: any) => {
                persistedCampaign = applyRealtimeStateUpdate(persistedCampaign, payload);
                return clone(persistedCampaign);
            }),
        };
    };

    afterEach(() => {
        sinon.restore();
    });

    it('should reuse the active campaign cache for token updates', async () => {
        const clock = sinon.useFakeTimers();
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.campaignPlayers = [
            {
                userId: 'user-1',
                characterIds: ['character-1'],
                role: 'dungeon_master',
                status: 'active',
            },
        ];
        const campaignsRepository = buildCampaignRepository(campaign);
        const socketIO = new SocketIO({
            campaignsRepository,
            tokenForbidden,
            redisClient: null,
            logger,
        } as any);

        try {
            const activeCampaign = await (socketIO as any).getActiveCampaign(campaign.campaignId);
            const token = activeCampaign.matchData.state.tokens[0];
            const socket = {
                data: {
                    campaignId: campaign.campaignId,
                    user: {
                        userId: token.createdBy,
                    },
                    role: 'dungeon_master',
                },
            } as any;

            await (socketIO as any).updateToken(socket, {
                campaignId: campaign.campaignId,
                tokenId: token.tokenId,
                xPct: 25,
                yPct: 35,
                widthPct: 6,
            });

            expect(campaignsRepository.findOne).to.have.been.calledOnce;
            expect(campaignsRepository.update).not.to.have.been.called();
            expect(campaignsRepository.updateRealtimeState).not.to.have.been.called();

            await clock.tickAsync(500);

            expect(campaignsRepository.updateRealtimeState).to.have.been.calledOnce;
        } finally {
            clock.restore();
        }
    });

    it('should allow admin_player to move and resize tokens', async () => {
        const clock = sinon.useFakeTimers();
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.campaignPlayers = [
            {
                userId: 'token-owner',
                characterIds: ['character-1'],
                role: 'player',
                status: 'active',
            },
            {
                userId: 'admin-user',
                characterIds: [],
                role: 'admin_player',
                status: 'active',
            },
        ];

        const campaignsRepository = buildCampaignRepository(campaign);
        const socketIO = new SocketIO({
            campaignsRepository,
            tokenForbidden,
            redisClient: null,
            logger,
        } as any);

        try {
            const activeCampaign = await (socketIO as any).getActiveCampaign(campaign.campaignId);
            const token = activeCampaign.matchData.state.tokens[0];
            campaign.campaignPlayers[0].userId = token.createdBy;
            const socket = {
                data: {
                    campaignId: campaign.campaignId,
                    user: {
                        userId: 'admin-user',
                    },
                    role: 'admin_player',
                },
            } as any;

            const updatedToken = await (socketIO as any).updateToken(socket, {
                campaignId: campaign.campaignId,
                tokenId: token.tokenId,
                xPct: 25,
                yPct: 35,
                widthPct: 9,
            });

            expect(updatedToken.xPct).to.equal(25);
            expect(updatedToken.yPct).to.equal(35);
            expect(updatedToken.widthPct).to.equal(9);
            expect(updatedToken.updatedBy).to.equal('admin-user');
            expect(campaignsRepository.updateRealtimeState).not.to.have.been.called();

            await clock.tickAsync(500);

            expect(campaignsRepository.updateRealtimeState).to.have.been.calledOnce;
        } finally {
            clock.restore();
        }
    });

    it('should debounce persistence for repeated token batch updates', async () => {
        const clock = sinon.useFakeTimers();
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.campaignPlayers = [
            {
                userId: 'user-1',
                characterIds: ['character-1'],
                role: 'dungeon_master',
                status: 'active',
            },
        ];
        const campaignsRepository = buildCampaignRepository(campaign);
        const socketIO = new SocketIO({
            campaignsRepository,
            tokenForbidden,
            redisClient: null,
            logger,
        } as any);

        try {
            const activeCampaign = await (socketIO as any).getActiveCampaign(campaign.campaignId);
            const token = activeCampaign.matchData.state.tokens[0];
            const socket = {
                data: {
                    campaignId: campaign.campaignId,
                    user: {
                        userId: token.createdBy,
                    },
                    role: 'dungeon_master',
                },
            } as any;

            await (socketIO as any).updateTokensBatch(socket, campaign.campaignId, [
                {
                    campaignId: campaign.campaignId,
                    tokenId: token.tokenId,
                    xPct: 10,
                    yPct: 20,
                    widthPct: 6,
                },
            ]);

            await (socketIO as any).updateTokensBatch(socket, campaign.campaignId, [
                {
                    campaignId: campaign.campaignId,
                    tokenId: token.tokenId,
                    xPct: 15,
                    yPct: 25,
                    widthPct: 6,
                },
            ]);

            expect(campaignsRepository.findOne).to.have.been.calledOnce;
            expect(campaignsRepository.updateRealtimeState).not.to.have.been.called();

            await clock.tickAsync(500);

            expect(campaignsRepository.updateRealtimeState).to.have.been.calledOnce;
        } finally {
            clock.restore();
        }
    });

    it('should allow admin_player to batch move and resize tokens', async () => {
        const clock = sinon.useFakeTimers();
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.campaignPlayers = [
            {
                userId: 'token-owner',
                characterIds: ['character-1'],
                role: 'player',
                status: 'active',
            },
            {
                userId: 'admin-user',
                characterIds: [],
                role: 'admin_player',
                status: 'active',
            },
        ];

        const campaignsRepository = buildCampaignRepository(campaign);
        const socketIO = new SocketIO({
            campaignsRepository,
            tokenForbidden,
            redisClient: null,
            logger,
        } as any);

        try {
            const activeCampaign = await (socketIO as any).getActiveCampaign(campaign.campaignId);
            const token = activeCampaign.matchData.state.tokens[0];
            campaign.campaignPlayers[0].userId = token.createdBy;
            const socket = {
                data: {
                    campaignId: campaign.campaignId,
                    user: {
                        userId: 'admin-user',
                    },
                    role: 'admin_player',
                },
            } as any;

            const updatedTokens = await (socketIO as any).updateTokensBatch(socket, campaign.campaignId, [
                {
                    campaignId: campaign.campaignId,
                    tokenId: token.tokenId,
                    xPct: 40,
                    yPct: 50,
                    widthPct: 11,
                },
            ]);

            expect(updatedTokens).to.have.length(1);
            expect(updatedTokens[0].xPct).to.equal(40);
            expect(updatedTokens[0].yPct).to.equal(50);
            expect(updatedTokens[0].widthPct).to.equal(11);
            expect(updatedTokens[0].updatedBy).to.equal('admin-user');
            expect(campaignsRepository.updateRealtimeState).not.to.have.been.called();

            await clock.tickAsync(500);

            expect(campaignsRepository.updateRealtimeState).to.have.been.calledOnce;
        } finally {
            clock.restore();
        }
    });

    it('should force a pending flush when the last user leaves a campaign room', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.campaignPlayers = [
            {
                userId: 'user-1',
                characterIds: ['character-1'],
                role: 'dungeon_master',
                status: 'active',
            },
        ];
        const campaignsRepository = buildCampaignRepository(campaign);
        const socketIO = new SocketIO({
            campaignsRepository,
            tokenForbidden,
            redisClient: null,
            logger,
        } as any);

        const activeCampaign = await (socketIO as any).getActiveCampaign(campaign.campaignId);
        const token = activeCampaign.matchData.state.tokens[0];
        const socket = {
            id: 'socket-1',
            data: {
                campaignId: campaign.campaignId,
                user: {
                    userId: token.createdBy,
                },
                role: 'dungeon_master',
            },
        } as any;

        await (socketIO as any).updateToken(socket, {
            campaignId: campaign.campaignId,
            tokenId: token.tokenId,
            xPct: 60,
            yPct: 70,
            widthPct: 8,
        });

        (socketIO as any).addPresence(campaign.campaignId, {
            socketId: socket.id,
            userId: token.createdBy,
            role: 'dungeon_master',
        });

        expect(campaignsRepository.updateRealtimeState).not.to.have.been.called();

        await (socketIO as any).handleDisconnect(socket);

        expect(campaignsRepository.updateRealtimeState).to.have.been.calledOnce;
        expect((socketIO as any).getActiveCampaignEntry(campaign.campaignId)).to.equal(null);
    });

    it('should append a log when a new user joins a campaign room', async () => {
        const clock = sinon.useFakeTimers();
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.campaignPlayers = [
            {
                userId: 'user-1',
                characterIds: [],
                role: 'player',
                status: 'active',
            },
        ];
        const campaignsRepository = buildCampaignRepository(campaign);
        const socketIO = new SocketIO({
            campaignsRepository,
            tokenForbidden,
            redisClient: null,
            logger,
        } as any);
        const joinedRoomEmitter = { emit: sinon.stub() };
        const socket = {
            id: 'socket-1',
            data: {
                user: {
                    userId: 'user-1',
                    username: 'joe_the_great',
                },
            },
            join: sinon.stub().resolves(),
            leave: sinon.stub().resolves(),
            emit: sinon.stub(),
            to: sinon.stub().returns(joinedRoomEmitter),
        } as any;

        try {
            await (socketIO as any).joinCampaign(socket, { campaignId: campaign.campaignId });

            expect(campaignsRepository.updateRealtimeState).not.to.have.been.called();

            await clock.tickAsync(500);

            expect(campaignsRepository.updateRealtimeState).to.have.been.calledOnce;
            expect(campaignsRepository.updateRealtimeState.firstCall.args[1].logs.at(-1).content).to.equal(
                '[joe_the_great] joined the session'
            );
            expect(campaignsRepository.updateRealtimeState.firstCall.args[1].logs.at(-1).loggedAt).to.be.a('string');
        } finally {
            clock.restore();
        }
    });

    it('should append a log when the last socket of a user leaves a campaign room', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.campaignPlayers = [
            {
                userId: 'user-1',
                characterIds: [],
                role: 'player',
                status: 'active',
            },
        ];
        const campaignsRepository = buildCampaignRepository(campaign);
        const socketIO = new SocketIO({
            campaignsRepository,
            tokenForbidden,
            redisClient: null,
            logger,
        } as any);
        const socket = {
            id: 'socket-1',
            data: {
                campaignId: campaign.campaignId,
                user: {
                    userId: 'user-1',
                    username: 'joe_the_great',
                },
                role: 'player',
            },
        } as any;

        await (socketIO as any).getActiveCampaign(campaign.campaignId);
        (socketIO as any).addPresence(campaign.campaignId, {
            socketId: socket.id,
            userId: 'user-1',
            role: 'player',
            username: 'joe_the_great',
        });

        await (socketIO as any).handleDisconnect(socket);

        expect(campaignsRepository.updateRealtimeState).to.have.been.calledOnce;
        expect(campaignsRepository.updateRealtimeState.firstCall.args[1].logs.at(-1).content).to.equal(
            '[joe_the_great] left the session'
        );
        expect(campaignsRepository.updateRealtimeState.firstCall.args[1].logs.at(-1).loggedAt).to.be.a('string');
    });

    it('should initialize the redis adapter when a redis client is available', async () => {
        const adapterInstance = { name: 'redis-adapter' };
        const createAdapter = sinon.stub().returns(adapterInstance);
        const redisSubscriber = {
            isOpen: false,
            connect: sinon.stub().resolves(),
        };
        const redisClient = {
            duplicate: sinon.stub().returns(redisSubscriber),
        };
        const campaignsRepository = buildCampaignRepository(DomainDataFaker.generateCampaignsJSON()[0]);
        const socketIO = new SocketIO({
            campaignsRepository,
            tokenForbidden,
            redisClient,
            logger,
        } as any);
        const adapter = sinon.stub();
        const originalRequire = Module.prototype.require;

        sinon.stub(Module.prototype, 'require').callsFake(function (this: any, moduleId: string, ...args: any[]) {
            if (moduleId === '@socket.io/redis-adapter') {
                return { createAdapter };
            }

            return originalRequire.call(this, moduleId, ...args);
        });

        (socketIO as any).io = { adapter };

        await (socketIO as any).initializeRedisAdapter();

        expect(redisClient.duplicate).to.have.been.calledOnce;
        expect(redisSubscriber.connect).to.have.been.calledOnce;
        expect(createAdapter).to.have.been.calledWith(redisClient, redisSubscriber);
        expect(adapter).to.have.been.calledWith(adapterInstance);
    });
});
