import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import RacesModel from 'src/database/models/RacesModel';
import mocks from 'src/support/mocks';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Race } from 'src/schemas/racesValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Get RPG Races from database', () => {
    beforeAll(() => {
        connect();
    });

    afterAll(async () => {
        await close();
    });

    const model = new RacesModel();
    const race = mocks.race.instance as Internacional<Race>;
    const { _id: _, ...raceMockPayload } = race;

    let documentId: string;

    describe('When request all rpg Races', () => {
        it('should return an array with Races', async () => {
            const keysToTest = Object.keys(race.en);

            const response = await model.create(raceMockPayload);
            documentId = response._id as string;

            const { body } = await request(app).get('/races').expect(HttpStatusCode.OK);

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

            const { body } = await request(app).get(`/races/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await request(app).get(`/races/${generateNewMongoID()}`).expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a Race with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
