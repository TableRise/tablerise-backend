import sinon from 'sinon';
import requester from 'tests/support/requester';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import { InjectNewCharacter } from 'tests/support/dataInjector';
import DatabaseManagement from '@tablerise/database-management';
import DomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';

describe('When recover all characters', () => {
    let characters: CharacterInstance[],
    modelCharacter: any;

    context('And is succesfull', () => {
        before(async () => {
            modelCharacter = new DatabaseManagement().modelInstance('characterDnd', 'CharactersDnd');
            await modelCharacter.erase();
            characters = DomainDataFaker.generateCharactersJSON({ count : 2});
            characters.forEach(async (character) => {
                await InjectNewCharacter(character);
            })
        });

        after(async () => {
            sinon.restore();
            await modelCharacter.erase();
        });
        it('should return correct data', async () => {
            const { body } = await requester()
                .get('/characters')
                .expect(HttpStatusCode.OK);
            expect(body).to.be.an('array');
            expect(body.length).to.be.equal(characters.length);
            body.forEach((char: CharacterInstance) => {
                expect(char).to.be.not.null();
            });
        });
    });
});