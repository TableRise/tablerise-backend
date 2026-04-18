import sinon from 'sinon';
import RemoveCampaignPlayersService from 'src/core/campaigns/services/RemoveCampaignPlayersService';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import UsersDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { UserDetail, GameInfoCampaigns } from '@tablerise/database-management/dist/src/interfaces/User';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';

describe('Core :: Camapaigns :: Services :: RemoveCampaignPlayersService', () => {
    let removeCampaignPlayersService: RemoveCampaignPlayersService,
        campaignsRepository: any,
        usersDetailsRepository: any,
        removePlayersPayload: any,
        campaignPlayersLength: number,
        userDetailsCampaignsLength: number,
        campaign: Campaign,
        userDetails: UserDetail;

    const logger = (): void => {};

    context('#removeCampaignPlayers', () => {
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

                userDetails.gameInfo.campaigns = [{ campaignId: campaign.campaignId } as GameInfoCampaigns];

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
                removeCampaignPlayersService = new RemoveCampaignPlayersService({
                    logger,
                    campaignsRepository,
                    usersDetailsRepository,
                });
            });

            it('should remove the user details game info campaigns', async () => {
                const matchDataRemoved = await removeCampaignPlayersService.removeCampaignPlayers(removePlayersPayload);

                expect(matchDataRemoved.userDetails.gameInfo.campaigns.length).to.be.not.equal(
                    userDetailsCampaignsLength
                );

                expect(matchDataRemoved.userDetails.gameInfo.campaigns.length).to.be.equal(
                    userDetailsCampaignsLength - 1
                );
            });

            it('should return the removed campaign', async () => {
                const matchDataRemoved = await removeCampaignPlayersService.removeCampaignPlayers(removePlayersPayload);
                expect(matchDataRemoved.campaign.campaignPlayers.length).to.be.not.equal(campaignPlayersLength);
                expect(matchDataRemoved.campaign.campaignPlayers.length).to.be.equal(campaignPlayersLength - 1);
            });
        });

        context('When a player is removed from match but the player is the dungeon_master', () => {
            before(() => {
                campaign = DomainDataFaker.generateCampaignsJSON()[0];
                userDetails = UsersDataFaker.generateUserDetailsJSON()[0];

                campaign.campaignPlayers = [
                    {
                        userId: userDetails.userId,
                        characterIds: [],
                        role: 'dungeon_master',
                        status: 'active',
                    },
                ];

                userDetails.gameInfo.campaigns = [{ campaignId: campaign.campaignId } as GameInfoCampaigns];

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
                };
                removeCampaignPlayersService = new RemoveCampaignPlayersService({
                    logger,
                    campaignsRepository,
                    usersDetailsRepository,
                });
            });

            it('should throw an error', async () => {
                try {
                    await removeCampaignPlayersService.removeCampaignPlayers(removePlayersPayload);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('The new player can not be also the master');
                    expect(err.code).to.be.equal(HttpStatusCode.CONFLICT);
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.CONFLICT));
                }
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

                removeCampaignPlayersService = new RemoveCampaignPlayersService({
                    logger,
                    campaignsRepository,
                    usersDetailsRepository,
                });
            });

            it('should call correct methods', async () => {
                const saveCamapaignTest = await removeCampaignPlayersService.save(campaign, userDetails);

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
