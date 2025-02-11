import RecoverCharacterByCampaignService from 'src/core/characters/services/RecoverCharacterByCampaignService';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import fakers from 'src/infra/datafakers';

describe.only('Core :: Characters :: Services :: RecoverCharacterByCampaignService', () => {
    let recoverCharacterByCampaignService: RecoverCharacterByCampaignService,
        charactersRepository: any,
        campaignsRepository: any,
        result: any,
        campaign: CampaignInstance,
        character: CharacterInstance;

    const logger = (): void => {};

    context('#recoverByCampaign', () => {
        context('When recover character by campaign - role is player', () => {
            let campaignId: string;
            let userId: string;

            before(() => {
                campaign = fakers.campaign.generateCampaignsJSON()[0];
                character = fakers.character.generateCharactersJSON()[0];

                campaign.campaignPlayers[0].userId = character.author.userId;
                campaign.campaignPlayers[0].role = 'player';
                campaign.campaignPlayers[0].characterIds.push(
                    character.characterId as string
                );

                campaignId = campaign.campaignId;
                userId = campaign.campaignPlayers[0].userId;

                charactersRepository = {
                    findOne: () => character,
                };

                result = {
                    author: character.author,
                    picture: character.picture,
                    profile: character.data.profile,
                };

                campaignsRepository = {
                    findOne: () => campaign,
                };

                recoverCharacterByCampaignService = new RecoverCharacterByCampaignService(
                    {
                        charactersRepository,
                        campaignsRepository,
                        logger,
                    }
                );
            });

            it('should return correct character', async () => {
                const charactersTest =
                    await recoverCharacterByCampaignService.recoverByCampaign({
                        campaignId,
                        userId,
                    });
                expect(charactersTest).to.be.an('array').with.lengthOf(1);
                expect(charactersTest[0]).to.be.deep.equal(result);
            });
        });

        context('When recover character by campaign - role is dungeon_master', () => {
            let campaignId: string;
            let userId: string;

            before(() => {
                campaign = fakers.campaign.generateCampaignsJSON()[0];
                character = fakers.character.generateCharactersJSON()[0];

                campaign.campaignPlayers[0].userId = character.author.userId;
                campaign.campaignPlayers[0].role = 'dungeon_master';
                campaign.campaignPlayers[0].characterIds.push(
                    character.characterId as string
                );

                campaignId = campaign.campaignId;
                userId = campaign.campaignPlayers[0].userId;

                charactersRepository = {
                    findOne: () => character,
                };

                campaignsRepository = {
                    findOne: () => campaign,
                };

                recoverCharacterByCampaignService = new RecoverCharacterByCampaignService(
                    {
                        charactersRepository,
                        campaignsRepository,
                        logger,
                    }
                );
            });

            it('should return all characters', async () => {
                const charactersTest =
                    await recoverCharacterByCampaignService.recoverByCampaign({
                        campaignId,
                        userId,
                    });
                expect(charactersTest[0]).to.be.an('object');
                expect(charactersTest[0]).to.be.deep.equal(character);
            });
        });

        context('When recover character by campaign - player not in match', () => {
            let campaignId: string;
            let userId: string;

            before(() => {
                campaign = fakers.campaign.generateCampaignsJSON()[0];
                character = fakers.character.generateCharactersJSON()[0];

                campaign.campaignPlayers = [];

                campaignId = campaign.campaignId;
                userId = '123';

                charactersRepository = {
                    findOne: () => character,
                };

                campaignsRepository = {
                    findOne: () => campaign,
                };

                recoverCharacterByCampaignService = new RecoverCharacterByCampaignService(
                    {
                        charactersRepository,
                        campaignsRepository,
                        logger,
                    }
                );
            });

            it('should throw correct error', async () => {
                try {
                    await recoverCharacterByCampaignService.recoverByCampaign({
                        campaignId,
                        userId,
                    });
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'This players is not in the campaign'
                    );
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.NOT_FOUND));
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                }
            });
        });
    });
});
