import sinon from 'sinon';
import GetCampaignsByUserIdService from 'src/core/campaigns/services/GetCampaignsByUserIdService';
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

                userDetails.gameInfo.campaigns = [
                    {
                        campaignId: campaignIdOne,
                        role: 'dungeon_master',
                    },
                    {
                        campaignId: campaignIdTwo,
                        role: 'player',
                    },
                    {
                        campaignId: campaignIdThree,
                        role: 'player_admin',
                    },
                ];

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
    });
});
