import request from 'supertest';
import app from 'src/app';
import DatabaseManagement, { DnDRace, Internacional } from '@tablerise/database-management';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Get RPG Races from database', () => {
    const DM = new DatabaseManagement();

    const model = DM.modelInstance('dungeons&dragons5e', 'Races');
    const race = mocks.race.instance as Internacional<DnDRace>;
    const { _id: _, ...raceMockPayload } = race;

    let documentId: string;

    afterAll(async () => {
        await model.connection.close();
    });

    describe('When request all rpg Races', () => {
        it('should return an array with Races', async () => {
            const keysToTest = Object.keys(race.en);

            const response = await model.create(raceMockPayload);
            documentId = response._id as string;

            const { body } = await request(app).get('/dnd5e/races').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request all disabled rpg races', () => {
        it('should return an array with disabled races', async () => {
            const keysToTest = Object.keys(race.en);

            const raceMockCopy = {
                active: false,
                en: { ...raceMockPayload.en, active: false },
                pt: { ...raceMockPayload.pt, active: false },
            };

            const response = await model.create(raceMockCopy);
            documentId = response._id as string;

            const { body } = await request(app).get('/dnd5e/races/disabled').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request one rpg Race', () => {
        it('should return a Race instance', async () => {
            const keysToTest = Object.keys(race.en);

            await model.create(raceMockPayload);

            const { body } = await request(app).get(`/dnd5e/races/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await request(app)
                .get(`/dnd5e/races/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a race with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
