import sinon from 'sinon';
import UpdateCampaignService from 'src/core/campaigns/services/UpdateCampaignService';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Services :: UpdateCampaignService', () => {
    let updateCampaignService: UpdateCampaignService,
        campaign: any,
        campaignUpdatePayload: any,
        campaignsRepository: any,
        imageStorageClient: any;

    const logger = (): void => {};

    context('#update', () => {
        context('When a campaign is updated', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaignsRepository = {
                    findOne: () => campaign,
                };

                imageStorageClient = {
                    upload: () => ({
                        data: {
                            id: '123',
                            link: 'https://youtube.com/',
                            uploadDate: '2023-03-31Z17:58:00',
                        },
                    }),
                };

                campaignUpdatePayload = {
                    title: 'New title',
                    description: 'New description text',
                    visibility: 'hidden',
                };

                updateCampaignService = new UpdateCampaignService({
                    campaignsRepository,
                    imageStorageClient,
                    logger,
                });
            });

            it('should return correct data', async () => {
                const campaignUpdateTest = await updateCampaignService.update(campaignUpdatePayload);
                expect(campaignUpdateTest.title).to.be.equal(campaignUpdatePayload.title);
                expect(campaignUpdateTest.description).to.be.equal(campaignUpdatePayload.description);
                expect(campaignUpdateTest.infos.visibility).to.be.equal(campaignUpdatePayload.visibility);
            });
        });

        context('When a campaign is updated - with unsupported cover payload', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaignsRepository = {
                    findOne: () => campaign,
                };

                imageStorageClient = {};

                campaignUpdatePayload = {
                    title: 'New title',
                    description: 'New description text',
                    visibility: 'hidden',
                    cover: {},
                };

                updateCampaignService = new UpdateCampaignService({
                    campaignsRepository,
                    imageStorageClient,
                    logger,
                });
            });

            it('should return correct data', async () => {
                const campaignUpdateTest = await updateCampaignService.update(campaignUpdatePayload);

                expect(campaignUpdateTest.title).to.be.equal(campaignUpdatePayload.title);
                expect(campaignUpdateTest.description).to.be.equal(campaignUpdatePayload.description);
                expect(campaignUpdateTest.infos.visibility).to.be.equal(campaignUpdatePayload.visibility);
                expect(campaignUpdateTest.cover).to.deep.equal(campaign.cover);
            });
        });

        context('When a campaign is updated - without new infos', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaignsRepository = {
                    findOne: () => campaign,
                };

                imageStorageClient = {};

                campaignUpdatePayload = {};

                updateCampaignService = new UpdateCampaignService({
                    campaignsRepository,
                    imageStorageClient,
                    logger,
                });
            });

            it('should return correct data', async () => {
                const campaignUpdateTest = await updateCampaignService.update(campaignUpdatePayload);
                expect(campaignUpdateTest.title).to.be.equal(campaign.title);
                expect(campaignUpdateTest.description).to.be.equal(campaign.description);
                expect(campaignUpdateTest.infos.visibility).to.be.equal(campaign.infos.visibility);
            });
        });

        it('should merge social media, configurations and next session resume', async () => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];
            campaign.infos.socialMedia = { instagram: 'old' } as any;
            campaign.configurations = { xpSystem: false, shopSystem: false, shopOn: false } as any;
            campaign.matchData.nextSessionResume = 'Old resume' as any;

            campaignsRepository = {
                findOne: () => campaign,
            };

            updateCampaignService = new UpdateCampaignService({
                campaignsRepository,
                logger,
            } as any);

            const updated = await updateCampaignService.update({
                campaignId: campaign.campaignId,
                nextSessionResume: 'New resume',
                socialMedia: { youtube: 'new-channel' } as any,
                configurations: { shopSystem: true } as any,
            });

            expect(updated.matchData.nextSessionResume).to.equal('New resume');
            expect(updated.infos.socialMedia).to.deep.equal({
                instagram: 'old',
                youtube: 'new-channel',
            });
            expect(updated.configurations).to.deep.equal({
                xpSystem: false,
                shopSystem: true,
                shopOn: false,
            });
        });

        it('should update age restriction, next match date and player limit when provided', async () => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];

            campaignsRepository = {
                findOne: () => campaign,
            };

            updateCampaignService = new UpdateCampaignService({
                campaignsRepository,
                logger,
            } as any);

            const updated = await updateCampaignService.update({
                campaignId: campaign.campaignId,
                ageRestriction: '+18' as any,
                nextMatchDate: '2099-01-01',
                playerAmountLimit: 9 as any,
            });

            expect(updated.ageRestriction).to.equal('+18');
            expect(updated.infos.nextMatchDate).to.equal('2099-01-01');
            expect(updated.infos.playerAmountLimit).to.equal(9);
        });

        it('should reassign admin roles when adminId is none', async () => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];
            campaign.campaignPlayers = [
                { userId: 'dm-id', role: 'dungeon_master', status: 'active', characterIds: [] },
                { userId: 'admin-id', role: 'admin_player', status: 'active', characterIds: [] },
                { userId: 'player-id', role: 'player', status: 'active', characterIds: [] },
            ] as any;

            campaignsRepository = {
                findOne: () => campaign,
            };

            updateCampaignService = new UpdateCampaignService({
                campaignsRepository,
                logger,
            } as any);

            const updated = await updateCampaignService.update({
                campaignId: campaign.campaignId,
                adminId: 'none',
            } as any);

            expect(updated.campaignPlayers[1].role).to.equal('player');
            expect(updated.campaignPlayers[0].role).to.equal('dungeon_master');
        });

        it('should assign the requested admin player and demote the current one', async () => {
            campaign = DomainDataFaker.generateCampaignsJSON()[0];
            campaign.campaignPlayers = [
                { userId: 'dm-id', role: 'dungeon_master', status: 'active', characterIds: [] },
                { userId: 'admin-id', role: 'admin_player', status: 'active', characterIds: [] },
                { userId: 'player-id', role: 'player', status: 'active', characterIds: [] },
            ] as any;
            campaign.matchData = null as any;
            campaign.infos.socialMedia = null as any;

            campaignsRepository = {
                findOne: () => campaign,
            };

            updateCampaignService = new UpdateCampaignService({
                campaignsRepository,
                logger,
            } as any);

            const updated = await updateCampaignService.update({
                campaignId: campaign.campaignId,
                adminId: 'player-id',
            } as any);

            expect(updated.campaignPlayers[1].role).to.equal('player');
            expect(updated.campaignPlayers[2].role).to.equal('admin_player');
            expect(updated.infos.socialMedia).to.deep.equal({});
        });
    });

    context('#save', () => {
        context('When an updated campaign is saved', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];

                campaignsRepository = {
                    update: sinon.spy(() => campaign),
                };

                imageStorageClient = {};

                updateCampaignService = new UpdateCampaignService({
                    campaignsRepository,
                    imageStorageClient,
                    logger,
                });
            });

            it('should call correct methods and have correct return', async () => {
                const campaignUpdatedSaved = await updateCampaignService.save(campaign);
                expect(campaignUpdatedSaved).to.be.deep.equal(campaign);
                expect(campaignsRepository.update).to.have.been.calledWith({
                    query: { campaignId: campaign.campaignId },
                    payload: campaign,
                });
            });
        });
    });
});
