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
        userDetails: any,
        dungeonMasterDetails: any;

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
                dungeonMasterDetails = UsersDomainDataFaker.generateUserDetailsJSON()[0];
                dungeonMasterDetails.userId = dungeonMasterId;

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
                    findOne: sinon.stub().callsFake(async ({ userId }) => {
                        if (userId === playerId) return userDetails;
                        if (userId === dungeonMasterId) return dungeonMasterDetails;
                        return null;
                    }),
                    update: sinon.stub().callsFake(async ({ payload }) => payload),
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
                        .and(sinon.match.hasNested('gameInfo.badges', ['enthusiast'])),
                });
                expect(userDetails.xp).to.equal(600);
                expect(dungeonMasterDetails.xp).to.equal(50);
            });
        });

        it('should award the dm and a distinct approver separately', async () => {
            campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
            dungeonMasterId = newUUID();
            const approverId = newUUID();
            playerId = newUUID();
            userDetails = UsersDomainDataFaker.generateUserDetailsJSON()[0];
            userDetails.userId = playerId;
            userDetails.gameInfo.campaignsJoinedAmount = 0;
            dungeonMasterDetails = UsersDomainDataFaker.generateUserDetailsJSON()[0];
            dungeonMasterDetails.userId = dungeonMasterId;
            const approverDetails = UsersDomainDataFaker.generateUserDetailsJSON()[0];
            approverDetails.userId = approverId;

            campaign.campaignPlayers = [
                {
                    userId: dungeonMasterId,
                    characterIds: [],
                    role: 'dungeon_master',
                    status: 'active',
                },
                {
                    userId: approverId,
                    characterIds: [],
                    role: 'admin_player',
                    status: 'active',
                },
                {
                    userId: playerId,
                    characterIds: [],
                    role: 'player',
                    status: 'pending',
                },
            ] as Player[];

            confirmCampaignPlayerService = new ConfirmCampaignPlayerService({
                campaignsRepository: {
                    findOne: sinon.stub().resolves(campaign),
                    update: sinon.stub().callsFake(async ({ payload }) => payload),
                },
                usersDetailsRepository: {
                    findOne: sinon.stub().callsFake(async ({ userId }) => {
                        if (userId === playerId) return userDetails;
                        if (userId === dungeonMasterId) return dungeonMasterDetails;
                        if (userId === approverId) return approverDetails;
                        return null;
                    }),
                    update: sinon.stub().callsFake(async ({ payload }) => payload),
                },
                logger,
            } as any);

            await confirmCampaignPlayerService.confirm(campaign.campaignId as string, approverId, playerId);

            expect(userDetails.xp).to.equal(200);
            expect(dungeonMasterDetails.xp).to.equal(50);
            expect(approverDetails.xp).to.equal(50);
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

        it('should reject when the target player does not exist', async () => {
            campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
            dungeonMasterId = newUUID();

            campaign.campaignPlayers = [
                {
                    userId: dungeonMasterId,
                    characterIds: [],
                    role: 'dungeon_master',
                    status: 'active',
                },
            ] as Player[];

            confirmCampaignPlayerService = new ConfirmCampaignPlayerService({
                campaignsRepository: {
                    findOne: sinon.stub().resolves(campaign),
                    update: sinon.stub(),
                },
                usersDetailsRepository: {
                    findOne: sinon.stub(),
                    update: sinon.stub(),
                },
                logger,
            } as any);

            let thrownError;

            try {
                await confirmCampaignPlayerService.confirm(
                    campaign.campaignId as string,
                    dungeonMasterId,
                    'missing-user'
                );
            } catch (error) {
                thrownError = error;
            }

            expect((thrownError as HttpRequestErrors).message).to.equal('This player is not in the campaign');
        });

        it('should activate a player even when user details are missing', async () => {
            campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
            dungeonMasterId = newUUID();
            playerId = newUUID();

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

            confirmCampaignPlayerService = new ConfirmCampaignPlayerService({
                campaignsRepository: {
                    findOne: sinon.stub().resolves(campaign),
                    update: sinon.stub().callsFake(async ({ payload }) => payload),
                },
                usersDetailsRepository: {
                    findOne: sinon.stub().resolves(null),
                    update: sinon.stub(),
                },
                logger,
            } as any);

            const updatedCampaign = await confirmCampaignPlayerService.confirm(
                campaign.campaignId as string,
                dungeonMasterId,
                playerId
            );

            expect(updatedCampaign.campaignPlayers[1].status).to.equal('active');
        });
    });
});
