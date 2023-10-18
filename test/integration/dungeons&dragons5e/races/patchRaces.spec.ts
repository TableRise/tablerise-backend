import requester from '../../../support/requester';
import DatabaseManagement, { MongoModel, mongoose } from '@tablerise/database-management';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

import { Race } from 'src/schemas/dungeons&dragons5e/racesValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import logger from '@tablerise/dynamic-logger';

describe('Patch RPG races in database', () => {
    let model: MongoModel<Internacional<Race>>;
    const race = mocks.race.instance as Internacional<Race>;
    const { _id: _, ...racePayload } = race;

    let documentId: string;

    beforeAll(() => {
        DatabaseManagement.connect(true)
            .then(() => {
                logger('info', 'Test database connection instanciated');
            })
            .catch(() => {
                logger('error', 'Test database connection failed');
            });

        const database = new DatabaseManagement();
        model = database.modelInstance('dungeons&dragons5e', 'Races');
    });

    afterAll(async() => {
        await mongoose.connection.close();
    });

    describe('When update availability one rpg race', () => {
        it('should return a string with race updated id', async () => {
            const response = await model.create(racePayload);
            documentId = response._id as string;

            const { body } = await requester()
                .patch(`/dnd5e/races/${documentId}?availability=false`)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe(`Race ${documentId} was deactivated`);
            expect(body.name).toBe('success');
        });

        it('should fail when availability already enabled', async () => {
            const response = await model.create(racePayload);
            documentId = response._id as string;

            const { body } = await requester()
                .patch(`/dnd5e/races/${documentId}?availability=true`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail when availability already disabled', async () => {
            await requester().patch(`/dnd5e/races/${documentId}?availability=false`);

            const { body } = await requester()
                .patch(`/dnd5e/races/${documentId}?availability=false`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail when query is wrong', async () => {
            const { body } = await requester()
                .patch(`/dnd5e/races/${documentId}?availability=wrongQuery`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('The query is invalid');
            expect(body.name).toBe('Invalid Entry');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await requester()
                .patch(`/dnd5e/races/${generateNewMongoID()}?availability=false`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
