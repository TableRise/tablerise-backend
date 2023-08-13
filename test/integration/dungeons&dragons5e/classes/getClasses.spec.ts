import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../../connectDatabaseTest';
import ClassesModel from 'src/database/models/dungeons&dragons5e/ClassesModel';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Class } from 'src/schemas/dungeons&dragons5e/classesValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Get RPG classes from database', () => {
    beforeAll(() => {
        connect();
    });

    afterAll(async () => {
        await close();
    });

    const model = new ClassesModel();
    const _class = mocks.class.instance;
    const { _id: _, ...classMockPayload } = _class as Internacional<Class>;

    let documentId: string;

    describe('When request all rpg classes', () => {
        it('should return an array with classes', async () => {
            const keysToTest = [
                'name',
                'description',
                'hitPoints',
                'proficiencies',
                'equipment',
                'levelingSpecs',
                'characteristics',
            ];

            const response = await model.create(classMockPayload);
            documentId = response._id as string;

            const { body } = await request(app).get('/dnd5e/classes').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request all disabled rpg classes', () => {
        it('should return an array with disabled classes', async () => {
            const keysToTest = [
                'name',
                'description',
                'hitPoints',
                'proficiencies',
                'equipment',
                'levelingSpecs',
                'characteristics',
            ];
            const classMockCopy = {
                active: false,
                en: { ...classMockPayload.en, active: false },
                pt: { ...classMockPayload.pt, active: false },
            };

            const response = await model.create(classMockCopy);
            documentId = response._id as string;

            const { body } = await request(app).get('/dnd5e/classes/disabled').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request one rpg class', () => {
        it('should return a class instance', async () => {
            const keysToTest = [
                'name',
                'description',
                'hitPoints',
                'proficiencies',
                'equipment',
                'levelingSpecs',
                'characteristics',
            ];

            await model.create(classMockPayload);

            const { body } = await request(app).get(`/dnd5e/classes/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await request(app)
                .get(`/dnd5e/classes/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a class with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
