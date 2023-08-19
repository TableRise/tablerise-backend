import request from 'supertest';
import app from 'src/app';
import BackgroundsModel from 'src/database/models/dungeons&dragons5e/BackgroundsModel';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Background } from 'src/schemas/dungeons&dragons5e/backgroundsValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Connections from 'src/database/DatabaseConnection';

describe('Get RPG backgrounds from database', () => {
    const model = new BackgroundsModel();
    const background = mocks.background.instance;
    const { _id: _, ...backgroundMockPayload } = background as Internacional<Background>;

    let documentId: string;

    afterAll(async () => {
        await Connections['dungeons&dragons5e'].close();
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

            const { body } = await request(app).get('/dnd5e/backgrounds').expect(HttpStatusCode.OK);

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

            const { body } = await request(app).get('/dnd5e/backgrounds/disabled').expect(HttpStatusCode.OK);

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

            const { body } = await request(app).get(`/dnd5e/backgrounds/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await request(app)
                .get(`/dnd5e/backgrounds/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
