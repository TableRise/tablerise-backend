import path from 'path';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import CharacterDomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import { InjectNewCharacter } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When an organization symbol is uploaded', () => {
    let character: CharactersDnd, filePath: string;

    before(async () => {
        const [generated] = CharacterDomainDataFaker.generateCharactersJSON();
        character = generated;

        character.author = {
            userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
            nickname: 'test-user',
            fullname: 'Test User',
        };
        filePath = path.resolve(__dirname, '../../../support/assets/test-image-batman.jpeg');

        await InjectNewCharacter(character);
    });

    context('And all data is correct', () => {
        it('should return an error when organizations are not configured as a collection', async () => {
            const response = await requester()
                .post(`/characters/${character.characterId}/symbol`)
                .query({ orgName: 'Haka' })
                .set('Content-Type', 'multipart/form-data')
                .set('connection', 'keep-alive')
                .attach('picture', filePath)
                .expect(HttpStatusCode.INTERNAL_SERVER);

            expect(response.text).to.be.equal('Organizations are not configured for this character');
        });
    });
});
