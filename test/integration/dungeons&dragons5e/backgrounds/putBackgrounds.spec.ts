import requester from '../../../support/requester';
import DatabaseManagement, { MongoModel } from '@tablerise/database-management';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

import { Background } from 'src/schemas/dungeons&dragons5e/backgroundsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

describe('Put RPG backgrounds in database', () => {
    let model: MongoModel<Internacional<Background>>;
    const background = mocks.background.instance as Internacional<Background>;
    const { _id: _, ...backgroundPayload } = background;

    const newBackgroundPayload = {
        en: { ...backgroundPayload.en, name: 'Warrior' },
        pt: { ...backgroundPayload.pt, name: 'Warrior' },
    };

    let documentId: string;

    beforeAll(() => {
        const database = new DatabaseManagement();
        model = database.modelInstance('dungeons&dragons5e', 'Backgrounds');
    });

    describe('When update one rpg background', () => {
        it('should return updated background', async () => {
            const keysToTest = [
                'name',
                'description',
                'skillProficiencies',
                'languages',
                'equipment',
                'characteristics',
            ];

            const response = await model.create(backgroundPayload);
            documentId = response._id as string;

            const { body } = await requester()
                .put(`/dnd5e/backgrounds/${documentId}`)
                .send(newBackgroundPayload)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(body.en.name).toBe('Warrior');
            expect(body.pt.name).toBe('Warrior');
        });

        it('should fail when data is wrong', async () => {
            const { body } = await requester()
                .put(`/dnd5e/backgrounds/${documentId}`)
                .send({ data: null } as unknown as Internacional<Background>)
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.details[0].attribute).toBe('en');
            expect(body.details[0].reason).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail when try to change availability', async () => {
            const { body } = await requester()
                .put(`/dnd5e/backgrounds/${generateNewMongoID()}`)
                .send({ active: true, ...newBackgroundPayload })
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await requester()
                .put(`/dnd5e/backgrounds/${generateNewMongoID()}`)
                .send(newBackgroundPayload)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
