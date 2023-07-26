import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import RacesModel from 'src/database/models/RacesModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Race } from 'src/schemas/racesValidationSchema';
import mocks from 'src/support/mocks';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Put RPG Races in database', () => {
    beforeAll(() => {
        connect();
    });

    afterAll(async () => {
        await close();
    });

    const model = new RacesModel();
    const race = mocks.race.instance as Internacional<Race>;
    const { _id: _, ...racePayload } = race;

    const newRacePayload = {
        en: { ...racePayload.en, name: 'Race_testPut' },
        pt: { ...racePayload.pt, name: 'Race_testPut' },
    };

    let documentId: string;

    describe('When update one rpg Race', () => {
        it('should return updated Race', async () => {
            const keysToTest = Object.keys(race.en);

            const response = await model.create(racePayload);
            documentId = response._id as string;

            const { body } = await request(app)
                .put(`/races/${documentId}`)
                .send(newRacePayload)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(body.en.name).toBe('Race_testPut');
            expect(body.pt.name).toBe('Race_testPut');
        });

        it('should fail when data is wrong', async () => {
            const { body } = await request(app)
                .put(`/races/${documentId}`)
                .send({ data: null } as unknown as Internacional<Race>)
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(JSON.parse(body.message)[0].path[0]).toBe('en');
            expect(JSON.parse(body.message)[0].message).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .put(`/races/${generateNewMongoID()}`)
                .send(newRacePayload)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a Race with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
