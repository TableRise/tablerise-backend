import Campaign, { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import sinon from 'sinon';
import DeleteCampaignService from 'src/core/campaigns/services/DeleteCampaignService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import newUUID from 'src/domains/common/helpers/newUUID';
import CampaignDomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import CharactersDomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import UsersDomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Campaigns :: Services :: DeleteCampaignService', () => {
    let deleteCampaignService: DeleteCampaignService,
        campaignsRepository: any,
        usersDetailsRepository: any,
        charactersRepository: any,
        campaign: Campaign,
        userDetailsOne: UserDetail,
        userDetailsTwo: UserDetail,
        characterOne: CharactersDnd,
        characterTwo: CharactersDnd,
        dungeonMasterId: string,
        playerId: string;

    const logger = (): void => {};

    context('#deleteCampaign', () => {
        context('When caller is dungeon_master', () => {
            beforeEach(() => {
                campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
                userDetailsOne = UsersDomainDataFaker.generateUserDetailsJSON()[0];
                userDetailsTwo = UsersDomainDataFaker.generateUserDetailsJSON()[0];
                characterOne = CharactersDomainDataFaker.generateCharactersJSON()[0];
                characterTwo = CharactersDomainDataFaker.generateCharactersJSON()[0];

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

                userDetailsOne.userId = dungeonMasterId;
                userDetailsOne.gameInfo.campaigns = [
                    { campaignId: campaign.campaignId as string, notes: [] },
                    { campaignId: 'another-campaign', notes: [] },
                ] as any;
                userDetailsTwo.userId = playerId;
                userDetailsTwo.gameInfo.campaigns = [{ campaignId: campaign.campaignId as string, notes: [] }] as any;

                characterOne.characterId = newUUID();
                characterOne.campaignId = campaign.campaignId as string;
                characterTwo.characterId = newUUID();
                characterTwo.campaignId = campaign.campaignId as string;

                campaignsRepository = {
                    findOne: sinon.stub().resolves(campaign),
                    delete: sinon.stub().resolves(),
                };

                usersDetailsRepository = {
                    findOne: sinon.stub().callsFake(async ({ userId }) => {
                        if (userId === dungeonMasterId) return userDetailsOne;
                        return userDetailsTwo;
                    }),
                    update: sinon.stub().resolves(),
                };

                charactersRepository = {
                    find: sinon.stub().resolves([characterOne, characterTwo]),
                    update: sinon.stub().resolves(),
                };

                deleteCampaignService = new DeleteCampaignService({
                    campaignsRepository,
                    usersDetailsRepository,
                    charactersRepository,
                    logger,
                });
            });

            it('should delete campaign, clean user links and detach characters', async () => {
                await deleteCampaignService.deleteCampaign(campaign.campaignId as string, dungeonMasterId);

                expect(campaignsRepository.findOne).to.have.been.calledWith({ campaignId: campaign.campaignId });
                expect(usersDetailsRepository.findOne).to.have.been.calledTwice();
                expect(usersDetailsRepository.update.firstCall.args[0].payload.gameInfo.campaigns).to.be.deep.equal([
                    { campaignId: 'another-campaign', notes: [] },
                ]);
                expect(usersDetailsRepository.update.secondCall.args[0].payload.gameInfo.campaigns).to.be.deep.equal(
                    []
                );
                expect(charactersRepository.find).to.have.been.calledWith({ campaignId: campaign.campaignId });
                expect(charactersRepository.update.firstCall.args[0]).to.be.deep.equal({
                    query: { characterId: characterOne.characterId },
                    payload: { campaignId: null },
                });
                expect(charactersRepository.update.secondCall.args[0]).to.be.deep.equal({
                    query: { characterId: characterTwo.characterId },
                    payload: { campaignId: null },
                });
                expect(campaignsRepository.delete).to.have.been.calledWith({ campaignId: campaign.campaignId });
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
                    delete: sinon.stub().resolves(),
                };

                usersDetailsRepository = {
                    findOne: sinon.stub().resolves({}),
                    update: sinon.stub().resolves(),
                };

                charactersRepository = {
                    find: sinon.stub().resolves([]),
                    update: sinon.stub().resolves(),
                };

                deleteCampaignService = new DeleteCampaignService({
                    campaignsRepository,
                    usersDetailsRepository,
                    charactersRepository,
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
    });
});
