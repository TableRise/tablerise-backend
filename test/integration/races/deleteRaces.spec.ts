import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import RacesModel from 'src/database/models/RacesModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Race } from 'src/schemas/racesValidationSchema';
import mocks from 'src/support/mocks';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Delete RPG Races in database', () => {
    beforeAll(() => {
        connect();
    });

    afterAll(async () => {
        await close();
    });

    const model = new RacesModel();
    const Race = mocks.race.instance as Internacional<Race>;
    const { _id: _, ...RacePayload } = Race;

    let documentId: string;

    describe('When delete one rpg Race', () => {
        it('should return 204 status with no content', async () => {
            const response = await model.create(RacePayload);
            documentId = response._id as string;

            const { body } = await request(app).delete(`/races/${documentId}`).expect(HttpStatusCode.DELETED);

            expect(body).toStrictEqual({});
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .delete(`/races/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a race with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
