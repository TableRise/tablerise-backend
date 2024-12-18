import sinon from 'sinon';
import RemoveMatchPlayersService from 'src/core/campaigns/services/RemoveMatchPlayersService';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import UsersDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';

describe('Core :: Camapaigns :: Services :: RemoveMatchPlayersService', () => {
    let removeMatchPlayersService: RemoveMatchPlayersService,
        campaignsRepository: any,
        usersDetailsRepository: any,
        removePlayersPayload: any,
        campaignPlayersLength: number,
        userDetailsCampaignsLength: number,
        campaign: CampaignInstance,
        userDetails: UserDetailInstance;

    const logger = (): void => {};

    context('#removeMatchPlayers', () => {
        context('When a player is removed from match', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                userDetails = UsersDataFaker.generateUserDetailsJSON()[0];

                campaign.campaignPlayers = [
                    {
                        userId: userDetails.userId,
                        characterIds: [],
                        role: 'player',
                        status: 'banned',
                    },
                ];

                userDetails.gameInfo.campaigns = [campaign.campaignId];

                userDetailsCampaignsLength = userDetails.gameInfo.campaigns.length;
                campaignPlayersLength = campaign.campaignPlayers.length;

                campaignsRepository = {
                    findOne: () => ({ ...campaign }),
                };

                usersDetailsRepository = {
                    findOne: () => ({ ...userDetails }),
                };

                removePlayersPayload = {
                    campaignId: campaign.campaignId,
                    userId: userDetails.userId,
                    operation: 'remove',
                };
                removeMatchPlayersService = new RemoveMatchPlayersService({
                    logger,
                    campaignsRepository,
                    usersDetailsRepository,
                });
            });

            it('should remove the user details game info campaigns', async () => {
                const matchDataRemoved =
                    await removeMatchPlayersService.removeMatchPlayers(
                        removePlayersPayload
                    );

                expect(
                    matchDataRemoved.userDetails.gameInfo.campaigns.length
                ).to.be.not.equal(userDetailsCampaignsLength);

                expect(
                    matchDataRemoved.userDetails.gameInfo.campaigns.length
                ).to.be.equal(userDetailsCampaignsLength - 1);
            });

            it('should return the removed campaign', async () => {
                const matchDataRemoved =
                    await removeMatchPlayersService.removeMatchPlayers(
                        removePlayersPayload
                    );
                expect(matchDataRemoved.campaign.campaignPlayers.length).to.be.not.equal(
                    campaignPlayersLength
                );
                expect(matchDataRemoved.campaign.campaignPlayers.length).to.be.equal(
                    campaignPlayersLength - 1
                );
            });
        });
    });

    context('#save', () => {
        context('When a campaign with a new player is saved', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                userDetails = UsersDataFaker.generateUserDetailsJSON()[0];

                campaign.campaignPlayers = [
                    {
                        userId: userDetails.userId,
                        characterIds: [],
                        role: 'player',
                        status: 'banned',
                    },
                ];

                campaignsRepository = {
                    update: sinon.spy(() => campaign),
                };

                usersDetailsRepository = {
                    update: sinon.spy(() => {}),
                };

                removeMatchPlayersService = new RemoveMatchPlayersService({
                    logger,
                    campaignsRepository,
                    usersDetailsRepository,
                });
            });

            it('should call correct methods', async () => {
                const saveCamapaignTest = await removeMatchPlayersService.save(
                    campaign,
                    userDetails
                );

                expect(saveCamapaignTest).to.be.deep.equal(campaign);
                expect(usersDetailsRepository.update).to.have.been.calledWith({
                    query: { userDetailId: userDetails.userDetailId },
                    payload: userDetails,
                });
                expect(campaignsRepository.update).to.have.been.calledWith({
                    query: { campaignId: campaign.campaignId },
                    payload: campaign,
                });
            });
        });
    });
});
