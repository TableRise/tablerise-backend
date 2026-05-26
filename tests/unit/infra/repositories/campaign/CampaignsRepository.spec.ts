import sinon from 'sinon';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import newUUID from 'src/domains/common/helpers/newUUID';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';

describe('Infra :: Repositories :: Campaign :: CampaignsRepository', () => {
    let campaignsRepository: CampaignsRepository,
        updateTimestampRepository: any,
        database: any,
        serializer: any,
        campaign: Campaign,
        query: any,
        createdCampaign: any,
        campaignToCreate: any,
        campaigns: any,
        campaignToUpdate: any;

    const logger = (): void => {};

    context('#create', () => {
        createdCampaign = DomainDataFaker.mocks.campaignMock;
        const create = sinon.spy(() => createdCampaign);

        beforeEach(() => {
            campaignToCreate = DomainDataFaker.mocks.createCampaignMock;

            database = {
                modelInstance: () => ({
                    create,
                }),
            };

            serializer = {
                postCampaign: (obj: any) => obj,
            };

            updateTimestampRepository = {};

            campaignsRepository = new CampaignsRepository({
                database,
                updateTimestampRepository,
                serializer,
                logger,
            });
        });

        it('should create an campaign and return serialized', async () => {
            const result = await campaignsRepository.create(campaignToCreate);

            expect(create).to.have.been.called();
            expect(result).to.have.property('title');
            expect(result.title).to.be.equal(campaignToCreate.title);
        });
    });

    context('#findOne', () => {
        context('When a campaign is recovered from database', () => {
            const campaignId = newUUID();

            before(() => {
                campaign = {
                    campaignId,
                } as Campaign;

                database = {
                    modelInstance: () => ({ findOne: () => campaign }),
                };

                serializer = {
                    postCampaign: (payload: any) => payload,
                };

                query = {
                    campaignId,
                };

                updateTimestampRepository = {};

                campaignsRepository = new CampaignsRepository({
                    database,
                    updateTimestampRepository,
                    serializer,
                    logger,
                });
            });

            it('should return correct result', async () => {
                const campaignTest = await campaignsRepository.findOne(query);
                expect(campaignTest).to.be.deep.equal(campaign);
            });
        });

        context('When a campaign is closed', () => {
            const campaignId = newUUID();

            before(() => {
                campaign = {
                    campaignId,
                    status: 'closed',
                } as Campaign;

                database = {
                    modelInstance: () => ({ findOne: () => campaign }),
                };

                serializer = {
                    postCampaign: (payload: any) => payload,
                };

                updateTimestampRepository = {};

                campaignsRepository = new CampaignsRepository({
                    database,
                    updateTimestampRepository,
                    serializer,
                    logger,
                });
            });

            it('should return null', async () => {
                const campaignTest = await campaignsRepository.findOne({ campaignId });
                expect(campaignTest).to.equal(null);
            });
        });

        context('When a campaign is not recovered from database', () => {
            const campaignId = newUUID();

            before(() => {
                campaign = {
                    campaignId,
                } as Campaign;

                database = {
                    modelInstance: () => ({ findOne: () => null }),
                };

                serializer = {
                    postCampaign: (payload: any) => payload,
                };

                updateTimestampRepository = {};

                campaignsRepository = new CampaignsRepository({
                    database,
                    updateTimestampRepository,
                    serializer,
                    logger,
                });
            });

            it('should return correct result', async () => {
                try {
                    await campaignsRepository.findOne();
                    expect.fail('it should bot be here');
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Campaign does not exist');
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.be.equal('NotFound');
                }
            });
        });
    });

    context('#find', () => {
        const findAll = sinon.spy(() => campaigns);

        beforeEach(() => {
            campaigns = DomainDataFaker.generateCampaignsJSON({ count: 1 });

            database = {
                modelInstance: () => ({ findAll }),
            };

            serializer = {
                postCampaign: (obj: any) => obj,
            };

            campaignsRepository = new CampaignsRepository({
                database,
                serializer,
                updateTimestampRepository,
                logger,
            });
        });

        it('should return all campaigns in database', async () => {
            const campaignsTest = await campaignsRepository.find();
            expect(findAll).to.have.been.called();
            expect(campaignsTest).to.have.length(campaigns.length);
            expect(campaignsTest[0]).to.include({
                campaignId: campaigns[0].campaignId,
                title: campaigns[0].title,
            });
        });

        it('should filter closed campaigns from result', async () => {
            campaigns = [
                ...(DomainDataFaker.generateCampaignsJSON({ count: 1 }) as Campaign[]),
                { ...DomainDataFaker.generateCampaignsJSON({ count: 0 })[0], status: 'closed' } as Campaign,
            ];

            const campaignsTest = await campaignsRepository.find();
            expect(campaignsTest).to.have.length(1);
            expect(campaignsTest.some((campaignResult) => campaignResult.status === 'closed')).to.equal(false);
        });
    });
    context('#update', () => {
        context('When a campaign is updated', () => {
            const campaignId = newUUID();

            before(() => {
                campaign = {
                    campaignId,
                } as Campaign;

                database = {
                    modelInstance: () => ({ update: () => campaign }),
                };

                serializer = {
                    postCampaign: (payload: any) => payload,
                };

                query = {
                    campaignId,
                };

                campaign.createdAt = new Date().toISOString();
                campaign.updatedAt = new Date().toISOString();

                updateTimestampRepository = {
                    updateTimestamp: () => campaign,
                };
                campaignToUpdate = { ...campaign, description: '123' };

                updateTimestampRepository = { updateTimestamp: () => {} };

                campaignsRepository = new CampaignsRepository({
                    database,
                    updateTimestampRepository,
                    serializer,
                    logger,
                });
            });

            it('should return correct result', async () => {
                const campaignTest = await campaignsRepository.update({
                    query,
                    payload: campaignToUpdate,
                });
                expect(campaignTest).to.be.deep.equal(campaign);
            });
        });

        context('When a campaign for update is not recovered from database', () => {
            const campaignId = newUUID();

            before(() => {
                campaign = {
                    campaignId,
                } as Campaign;

                database = {
                    modelInstance: () => ({ update: () => null }),
                };

                serializer = {
                    postCampaign: (payload: any) => payload,
                };

                updateTimestampRepository = {};

                campaignsRepository = new CampaignsRepository({
                    database,
                    updateTimestampRepository,
                    serializer,
                    logger,
                });
            });

            it('should return correct result', async () => {
                try {
                    await campaignsRepository.update({
                        query: { campaignId },
                        payload: campaign,
                    });
                    expect.fail('it should bot be here');
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Campaign does not exist');
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.be.equal('NotFound');
                }
            });
        });
    });

    context('#updateRealtimeState', () => {
        let update: sinon.SinonSpy;

        beforeEach(() => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0] as Campaign;
            update = sinon.spy((_query: any, payload: any) => ({
                ...campaign,
                payload,
            }));

            database = {
                modelInstance: () => ({ update }),
            };

            serializer = {
                postCampaign: (payload: any) => payload,
            };

            updateTimestampRepository = {
                updateTimestamp: sinon.stub().resolves(),
            };

            campaignsRepository = new CampaignsRepository({
                database,
                updateTimestampRepository,
                serializer,
                logger,
            });
        });

        it('should build a partial realtime update payload for hot state fields', async () => {
            await campaignsRepository.updateRealtimeState(
                campaign.campaignId as string,
                {
                    matchStateFields: {
                        activeMapId: 'map-2',
                        gridVisible: false,
                    },
                    tokens: [],
                    logs: [{ loggedAt: new Date().toISOString(), content: 'token moved' }],
                    confirmedPlayers: ['user-1'],
                } as any
            );

            expect(update).to.have.been.calledWith(
                { campaignId: campaign.campaignId },
                {
                    $set: {
                        'matchData.state.activeMapId': 'map-2',
                        'matchData.state.gridVisible': false,
                        'matchData.state.tokens': [],
                        'matchData.logs': [{ loggedAt: sinon.match.string, content: 'token moved' }],
                        'matchData.confirmedPlayers': ['user-1'],
                    },
                }
            );
        });

        it('should update tokens through the dedicated helper', async () => {
            await campaignsRepository.updateTokens(campaign.campaignId as string, []);

            expect(update).to.have.been.calledWith(
                { campaignId: campaign.campaignId },
                {
                    $set: {
                        'matchData.state.tokens': [],
                    },
                }
            );
        });

        it('should update highlighted journal through the dedicated helper', async () => {
            await campaignsRepository.updateHighlightedJournal(campaign.campaignId as string, null as any);

            expect(update).to.have.been.calledWith(
                { campaignId: campaign.campaignId },
                {
                    $set: {
                        'infos.highlightedJournal': null,
                    },
                }
            );
        });

        it('should update buys through the dedicated helper', async () => {
            await campaignsRepository.updateBuys(campaign.campaignId as string, [
                {
                    name: 'Potion',
                    cost: '10 gp',
                    character: 'Lia',
                    user: 'user-1',
                    date: '2026-05-16',
                },
            ]);

            expect(update).to.have.been.calledWith(
                { campaignId: campaign.campaignId },
                {
                    $set: {
                        buys: [
                            {
                                name: 'Potion',
                                cost: '10 gp',
                                character: 'Lia',
                                user: 'user-1',
                                date: '2026-05-16',
                            },
                        ],
                    },
                }
            );
        });

        it('should update match logs through the dedicated helper', async () => {
            const logs = [{ loggedAt: '2026-05-25', content: 'updated log' }];

            await campaignsRepository.updateMatchLogs(campaign.campaignId as string, logs as any);

            expect(update).to.have.been.calledWith(
                { campaignId: campaign.campaignId },
                {
                    $set: {
                        'matchData.logs': logs,
                    },
                }
            );
        });

        it('should update confirmed players through the dedicated helper', async () => {
            const confirmedPlayers = ['user-1'];

            await campaignsRepository.updateConfirmedPlayers(campaign.campaignId as string, confirmedPlayers as any);

            expect(update).to.have.been.calledWith(
                { campaignId: campaign.campaignId },
                {
                    $set: {
                        'matchData.confirmedPlayers': confirmedPlayers,
                    },
                }
            );
        });

        it('should return findOne when no realtime payload keys are provided', async () => {
            const findOneStub = sinon.stub(campaignsRepository, 'findOne').resolves(campaign);

            const result = await campaignsRepository.updateRealtimeState(campaign.campaignId as string, {});

            expect(findOneStub).to.have.been.calledWith({ campaignId: campaign.campaignId });
            expect(result).to.equal(campaign);
        });

        it('should update match state fields through the dedicated helper', async () => {
            await campaignsRepository.updateMatchStateFields(
                campaign.campaignId as string,
                {
                    activeEffect: 'fog',
                } as any
            );

            expect(update).to.have.been.calledWith(
                { campaignId: campaign.campaignId },
                {
                    $set: {
                        'matchData.state.activeEffect': 'fog',
                    },
                }
            );
        });
    });

    context('#delete', () => {
        const remove = sinon.spy(() => undefined);

        beforeEach(() => {
            database = {
                modelInstance: () => ({ delete: remove }),
            };

            serializer = {
                postCampaign: (payload: any) => payload,
            };

            campaignsRepository = new CampaignsRepository({
                database,
                serializer,
                updateTimestampRepository,
                logger,
            });
        });

        it('should delegate delete to model', async () => {
            await campaignsRepository.delete({ campaignId: '123' });

            expect(remove).to.have.been.calledWith({ campaignId: '123' });
        });
    });
});
