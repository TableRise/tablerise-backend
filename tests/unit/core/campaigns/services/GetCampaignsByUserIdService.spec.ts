import sinon from 'sinon';
import GetCampaignsByUserIdService from 'src/core/users/services/users/GetCampaignsByUserIdService';
import newUUID from 'src/domains/common/helpers/newUUID';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import CampaignDomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';

describe('Core :: Campaigns :: Services :: GetCampaignsByUserIdService', () => {
    let getCampaignsByUserIdService: GetCampaignsByUserIdService,
        campaignsRepository: any,
        userDetails: any,
        campaign: any,
        usersDetailsRepository: any;

    const logger = (): void => {};

    context('#getByUserId', () => {
        context('When a campaign is recovered by user id', () => {
            const campaignIdOne = newUUID();
            const campaignIdTwo = newUUID();
            const campaignIdThree = newUUID();

            before(() => {
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                campaign = CampaignDomainDataFaker.generateCampaignsJSON({ count: 3 });

                campaign[0].campaignId = campaignIdOne;
                campaign[1].campaignId = campaignIdTwo;
                campaign[2].campaignId = campaignIdThree;
                campaign[0].campaignPlayers = [
                    {
                        userId: userDetails.userId,
                        characterIds: [],
                        role: 'dungeon_master',
                        status: 'active',
                        notes: [],
                    },
                ];
                campaign[1].campaignPlayers = [
                    { userId: userDetails.userId, characterIds: [], role: 'player', status: 'active', notes: [] },
                ];
                campaign[2].campaignPlayers = [
                    { userId: userDetails.userId, characterIds: [], role: 'admin_player', status: 'active', notes: [] },
                ];

                userDetails.gameInfo.campaigns = [campaignIdOne, campaignIdTwo, campaignIdThree];

                usersDetailsRepository = {
                    findOne: sinon.spy(() => userDetails),
                };

                campaignsRepository = {
                    findOne: sinon.spy(({ campaignId }) => {
                        return campaign.find((c: any) => c.campaignId === campaignId);
                    }),
                };

                getCampaignsByUserIdService = new GetCampaignsByUserIdService({
                    campaignsRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const userCampaigns = await getCampaignsByUserIdService.getByUserId(userDetails.userId);
                expect(userCampaigns).to.have.property('master').to.be.an('array').that.has.lengthOf(1);
                expect(userCampaigns).to.have.property('player').to.be.an('array').that.has.lengthOf(2);
                expect(usersDetailsRepository.findOne).to.have.been.called();
                expect(campaignsRepository.findOne).to.have.been.called();
            });
        });

        context('When a campaign is recovered by user id - user not in campaigns', () => {
            const campaignIdOne = newUUID();
            const campaignIdTwo = newUUID();
            const campaignIdThree = newUUID();

            before(() => {
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                campaign = CampaignDomainDataFaker.generateCampaignsJSON({ count: 3 });

                campaign[0].campaignId = campaignIdOne;
                campaign[1].campaignId = campaignIdTwo;
                campaign[2].campaignId = campaignIdThree;

                userDetails.gameInfo.campaigns = [];

                usersDetailsRepository = {
                    findOne: sinon.spy(() => userDetails),
                };

                campaignsRepository = {
                    findOne: sinon.spy((campaignId: string) => {
                        return campaign.find((c: any) => c.campaignId === campaignId);
                    }),
                };

                getCampaignsByUserIdService = new GetCampaignsByUserIdService({
                    campaignsRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                try {
                    await getCampaignsByUserIdService.getByUserId(userDetails.userId);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('This player is not in the campaign');
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.NOT_FOUND));
                }
            });
        });

        context('When the user detail does not exist anymore', () => {
            before(() => {
                usersDetailsRepository = {
                    findOne: sinon.spy(() => null),
                };

                campaignsRepository = {
                    findOne: sinon.spy(),
                };

                getCampaignsByUserIdService = new GetCampaignsByUserIdService({
                    campaignsRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should throw user not found', async () => {
                try {
                    await getCampaignsByUserIdService.getByUserId('missing-user');
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('User does not exist');
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.NOT_FOUND));
                }
            });
        });

        context('When stored campaign ids no longer resolve to campaigns or roles', () => {
            before(() => {
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.gameInfo.campaigns = ['missing-campaign', 'campaign-without-player'];

                usersDetailsRepository = {
                    findOne: sinon.spy(() => userDetails),
                };

                campaignsRepository = {
                    findOne: sinon.spy(({ campaignId }) =>
                        campaignId === 'campaign-without-player'
                            ? {
                                  campaignId,
                                  campaignPlayers: [],
                              }
                            : null
                    ),
                };

                getCampaignsByUserIdService = new GetCampaignsByUserIdService({
                    campaignsRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should skip unresolved campaigns without crashing', async () => {
                const result = await getCampaignsByUserIdService.getByUserId(userDetails.userId);

                expect(result.master).to.deep.equal([]);
                expect(result.player).to.deep.equal([]);
            });
        });
    });
});
