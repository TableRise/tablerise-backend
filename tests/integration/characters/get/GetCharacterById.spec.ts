import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import { InjectNewCharacter } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When recover character by id', () => {
    let characterOne: CharacterInstance;

    context('And data is correct', () => {
        before(async () => {
            characterOne = DomainDataFaker.generateCharactersJSON()[0];
            await InjectNewCharacter(characterOne);
        });

        it('should retrieve character created', async () => {
            const { body } = await requester()
                .get(`/characters/${characterOne.characterId as string}`)
                .expect(HttpStatusCode.OK);

            expect(body).to.be.an('object');
            expect(body.characterId).to.be.equal(characterOne.characterId);
        });
    });
});
