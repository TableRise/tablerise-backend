import sinon from 'sinon';
import Campaign, { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import ConfirmCampaignPlayerService from 'src/core/campaigns/services/ConfirmCampaignPlayerService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import newUUID from 'src/domains/common/helpers/newUUID';
import CampaignDomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import UsersDomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Campaigns :: Services :: ConfirmCampaignPlayerService', () => {
    let confirmCampaignPlayerService: ConfirmCampaignPlayerService,
        campaignsRepository: any,
        usersDetailsRepository: any,
        campaign: Campaign,
        dungeonMasterId: string,
        playerId: string,
        userDetails: any;

    const logger = (): void => {};

    context('#confirm', () => {
        context('When caller confirms a pending player', () => {
            beforeEach(() => {
                campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
                dungeonMasterId = newUUID();
                playerId = newUUID();
                userDetails = UsersDomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = playerId;
                userDetails.gameInfo.campaignsJoinedAmount = 1;

                campaign.campaignPlayers = [
                    {
                        userId: dungeonMasterId,
                        characterIds: [],
                        role: 'dungeon_master',
                        status: 'active',
                    },
                    {
                        userId: playerId,
                        characterIds: [],
                        role: 'player',
                        status: 'pending',
                    },
                ] as Player[];

                campaignsRepository = {
                    findOne: sinon.stub().resolves(campaign),
                    update: sinon.stub().callsFake(async ({ payload }) => payload),
                };

                usersDetailsRepository = {
                    findOne: sinon.stub().resolves(userDetails),
                    update: sinon.stub().resolves(userDetails),
                };

                confirmCampaignPlayerService = new ConfirmCampaignPlayerService({
                    campaignsRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should activate the player and increment campaignsJoinedAmount', async () => {
                const updatedCampaign = await confirmCampaignPlayerService.confirm(
                    campaign.campaignId as string,
                    dungeonMasterId,
                    playerId
                );

                expect(updatedCampaign.campaignPlayers[1].status).to.equal('active');
                expect(usersDetailsRepository.update).to.have.been.calledWith({
                    query: { userDetailId: userDetails.userDetailId },
                    payload: sinon.match
                        .hasNested('gameInfo.campaignsJoinedAmount', 2)
                        .and(sinon.match.hasNested('gameInfo.badges', ['enthusiast-badge'])),
                });
            });
        });

        context('When the target player is already active', () => {
            beforeEach(() => {
                campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
                dungeonMasterId = newUUID();
                playerId = newUUID();
                userDetails = UsersDomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = playerId;
                userDetails.gameInfo.campaignsJoinedAmount = 2;

                campaign.campaignPlayers = [
                    {
                        userId: dungeonMasterId,
                        characterIds: [],
                        role: 'dungeon_master',
                        status: 'active',
                    },
                    {
                        userId: playerId,
                        characterIds: [],
                        role: 'player',
                        status: 'active',
                    },
                ] as Player[];

                campaignsRepository = {
                    findOne: sinon.stub().resolves(campaign),
                    update: sinon.stub().callsFake(async ({ payload }) => payload),
                };

                usersDetailsRepository = {
                    findOne: sinon.stub().resolves(userDetails),
                    update: sinon.stub().resolves(userDetails),
                };

                confirmCampaignPlayerService = new ConfirmCampaignPlayerService({
                    campaignsRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should keep campaignsJoinedAmount unchanged', async () => {
                await confirmCampaignPlayerService.confirm(campaign.campaignId as string, dungeonMasterId, playerId);

                expect(usersDetailsRepository.update).to.not.have.been.called();
            });
        });

        context('When caller is not allowed to confirm', () => {
            beforeEach(() => {
                campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
                playerId = newUUID();

                campaign.campaignPlayers = [
                    {
                        userId: playerId,
                        characterIds: [],
                        role: 'player',
                        status: 'pending',
                    },
                ] as Player[];

                campaignsRepository = {
                    findOne: sinon.stub().resolves(campaign),
                    update: sinon.stub(),
                };

                usersDetailsRepository = {
                    findOne: sinon.stub(),
                    update: sinon.stub(),
                };

                confirmCampaignPlayerService = new ConfirmCampaignPlayerService({
                    campaignsRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should throw forbidden-role-operation', async () => {
                try {
                    await confirmCampaignPlayerService.confirm(campaign.campaignId as string, playerId, playerId);
                    expect.fail('it should not be here');
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.equal('The operation is forbidden for this role');
                    expect(err.code).to.equal(HttpStatusCode.BAD_REQUEST);
                    expect(err.name).to.equal(getErrorName(HttpStatusCode.BAD_REQUEST));
                }
            });
        });
    });
});
