import sinon from 'sinon';
import CampaignDomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import CharacterDomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import requester from 'tests/support/requester';
import { InjectNewCampaign, InjectNewCharacter } from 'tests/support/dataInjector';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';

describe('When a character is added to campaign', () => {
    let campaign: CampaignInstance, character: CharacterInstance;

    context('And all data is correct', () => {
        const userLoggedId = '12cd093b-0a8a-42fe-910f-001f2ab28454';

        before(async () => {
            campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
            character = CharacterDomainDataFaker.generateCharactersJSON()[0];

            character.author.userId = userLoggedId;

            campaign.campaignPlayers = [
                {
                    userId: userLoggedId,
                    characterIds: [],
                    role: 'player',
                    status: 'active',
                },
            ];

            await InjectNewCampaign(campaign);
            await InjectNewCharacter(character);
        });

        after(() => {
            sinon.restore();
        });

        it('should return correct campaign character added', async () => {
            const { body } = await requester()
                .patch(
                    `/campaigns/${
                        campaign.campaignId
                    }/update/player/character?characterId=${
                        character.characterId as string
                    }`
                )
                .expect(HttpStatusCode.CREATED);

            expect(body).to.have.property('campaignId');
            expect(body).to.have.property('campaignPlayers');
            expect(body.campaignPlayers).to.be.an('array').with.lengthOf(1);
            expect(body.campaignPlayers[0].characterIds)
                .to.be.an('array')
                .with.lengthOf(1);
            expect(body.campaignPlayers[0].characterIds[0]).to.be.equal(
                character.characterId
            );
        });
    });
});
