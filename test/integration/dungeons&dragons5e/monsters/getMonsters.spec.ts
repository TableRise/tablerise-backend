import request from 'supertest';
import app from 'src/app';
import MonstersModel from 'src/database/models/dungeons&dragons5e/MonstersModel';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Monster } from 'src/schemas/dungeons&dragons5e/monstersValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Connections from 'src/database/DatabaseConnection';

describe('Get RPG monsters from database', () => {
    const model = new MonstersModel();
    const monster = mocks.monster.instance;
    const { _id: _, ...monsterMockPayload } = monster as Internacional<Monster>;

    let documentId: string;

    afterAll(async () => {
        await Connections['dungeons&dragons5e'].close();
    });

    describe('When request all rpg monsters', () => {
        it('should return an array with monsters', async () => {
            const keysToTest = ['name', 'characteristics', 'stats', 'abilityScore', 'skills', 'actions', 'picture'];

            const response = await model.create(monsterMockPayload);
            documentId = response._id as string;

            const { body } = await request(app).get('/dnd5e/monsters').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request all disabled rpg monsters', () => {
        it('should return an array with disabled monsters', async () => {
            const keysToTest = ['name', 'characteristics', 'stats', 'abilityScore', 'skills', 'actions', 'picture'];

            const weaponMockCopy = {
                active: false,
                en: { ...monsterMockPayload.en, active: false },
                pt: { ...monsterMockPayload.pt, active: false },
            };

            const response = await model.create(weaponMockCopy);
            documentId = response._id as string;

            const { body } = await request(app).get('/dnd5e/monsters/disabled').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request one rpg monster', () => {
        it('should return a monster instance', async () => {
            const keysToTest = ['name', 'characteristics', 'stats', 'abilityScore', 'skills', 'actions', 'picture'];

            await model.create(monsterMockPayload);

            const { body } = await request(app).get(`/dnd5e/monsters/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await request(app)
                .get(`/dnd5e/monsters/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a monster with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});