import Campaign, { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import sinon from 'sinon';
import DeleteCampaignService from 'src/core/campaigns/services/DeleteCampaignService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import newUUID from 'src/domains/common/helpers/newUUID';
import CampaignDomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import UsersDomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Campaigns :: Services :: DeleteCampaignService', () => {
    let deleteCampaignService: DeleteCampaignService,
        campaignsRepository: any,
        usersDetailsRepository: any,
        campaign: Campaign,
        dungeonMasterId: string,
        playerId: string;

    const logger = (): void => {};

    context('#deleteCampaign', () => {
        context('When caller is dungeon_master', () => {
            beforeEach(() => {
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
                        status: 'active',
                    },
                ] as Player[];

                campaignsRepository = {
                    findOne: sinon.stub().resolves(campaign),
                    update: sinon.stub().callsFake(async ({ payload }) => payload),
                };

                usersDetailsRepository = {
                    findOne: sinon.stub().callsFake(async ({ userId }) => ({
                        ...UsersDomainDataFaker.generateUserDetailsJSON()[0],
                        userId,
                        gameInfo: {
                            campaigns: [],
                            characters: [],
                            badges: [],
                            campaignsClosedAmount: 1,
                        },
                    })),
                    update: sinon.stub().resolves(),
                };

                deleteCampaignService = new DeleteCampaignService({
                    campaignsRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should close the campaign by updating its status', async () => {
                const updatedCampaign = await deleteCampaignService.deleteCampaign(
                    campaign.campaignId as string,
                    dungeonMasterId
                );

                expect(campaignsRepository.findOne).to.have.been.calledWith({ campaignId: campaign.campaignId });
                expect(campaignsRepository.update).to.have.been.calledWith({
                    query: { campaignId: campaign.campaignId },
                    payload: sinon.match.has('status', 'closed'),
                });
                expect(usersDetailsRepository.update).to.have.callCount(2);
                expect(usersDetailsRepository.update.firstCall.args[0].payload.gameInfo.campaignsClosedAmount).to.equal(
                    2
                );
                expect(usersDetailsRepository.update.firstCall.args[0].payload.gameInfo.badges).to.deep.equal([
                    'warrior-badge',
                ]);
                expect(updatedCampaign.status).to.equal('closed');
            });
        });

        context('When caller is not dungeon_master', () => {
            beforeEach(() => {
                campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
                const callerId = newUUID();

                campaign.campaignPlayers = [
                    {
                        userId: callerId,
                        characterIds: [],
                        role: 'player',
                        status: 'active',
                    },
                ] as Player[];

                campaignsRepository = {
                    findOne: sinon.stub().resolves(campaign),
                    update: sinon.stub().resolves(campaign),
                };

                usersDetailsRepository = {
                    findOne: sinon.stub(),
                    update: sinon.stub(),
                };

                deleteCampaignService = new DeleteCampaignService({
                    campaignsRepository,
                    usersDetailsRepository,
                    logger,
                });

                dungeonMasterId = callerId;
            });

            it('should throw forbidden-role-operation', async () => {
                try {
                    await deleteCampaignService.deleteCampaign(campaign.campaignId as string, dungeonMasterId);
                    expect.fail('it should not be here');
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('The operation is forbidden for this role');
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.BAD_REQUEST));
                }
            });
        });

        it('should skip closed counter updates when a player user detail cannot be found', async () => {
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
                    status: 'active',
                },
            ] as Player[];

            deleteCampaignService = new DeleteCampaignService({
                campaignsRepository: {
                    findOne: sinon.stub().resolves(campaign),
                    update: sinon.stub().callsFake(async ({ payload }) => payload),
                },
                usersDetailsRepository: {
                    findOne: sinon.stub().callsFake(async ({ userId }) =>
                        userId === playerId
                            ? null
                            : {
                                  ...UsersDomainDataFaker.generateUserDetailsJSON()[0],
                                  userId,
                                  gameInfo: {
                                      campaigns: [],
                                      characters: [],
                                      badges: [],
                                      campaignsClosedAmount: 1,
                                  },
                              }
                    ),
                    update: sinon.stub().resolves(),
                },
                logger,
            } as any);

            const updatedCampaign = await deleteCampaignService.deleteCampaign(
                campaign.campaignId as string,
                dungeonMasterId
            );

            expect(updatedCampaign.status).to.equal('closed');
        });
    });
});
