import requester from '../../../support/requester';

import DatabaseManagement, { DnDBackground, Internacional } from '@tablerise/database-management';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Get RPG backgrounds from database', () => {
    const DM = new DatabaseManagement();

    const model = DM.modelInstance('dungeons&dragons5e', 'Backgrounds');
    const background = mocks.background.instance;
    const { _id: _, ...backgroundMockPayload } = background as Internacional<DnDBackground>;

    let documentId: string;

    afterAll(async () => {
        await model.connection.instance.close();
    });

    describe('When request all rpg backgrounds', () => {
        it('should return an array with backgrounds', async () => {
            const keysToTest = [
                'name',
                'description',
                'skillProficiences',
                'languages',
                'equipment',
                'characteristics',
            ];

            const response = await model.create(backgroundMockPayload);
            documentId = response._id as string;

            const { body } = await requester.get('/dnd5e/backgrounds').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request all disabled rpg backgrounds', () => {
        it('should return an array with disabled backgrounds', async () => {
            const keysToTest = [
                'name',
                'description',
                'skillProficiences',
                'languages',
                'equipment',
                'characteristics',
            ];
            const backgroundMockCopy = {
                active: false,
                en: { ...backgroundMockPayload.en, active: false },
                pt: { ...backgroundMockPayload.pt, active: false },
            };

            const response = await model.create(backgroundMockCopy);
            documentId = response._id as string;

            const { body } = await requester.get('/dnd5e/backgrounds/disabled').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request one rpg background', () => {
        it('should return a background instance', async () => {
            const keysToTest = [
                'name',
                'description',
                'skillProficiences',
                'languages',
                'equipment',
                'characteristics',
            ];

            await model.create(backgroundMockPayload);

            const { body } = await requester.get(`/dnd5e/backgrounds/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await requester
                .get(`/dnd5e/backgrounds/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a background with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
