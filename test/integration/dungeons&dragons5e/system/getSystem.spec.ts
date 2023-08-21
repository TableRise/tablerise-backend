import requester from '../../../support/requester';
import DatabaseManagement, { DnDSystem, mongoose, MongoModel } from '@tablerise/database-management';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

import logger from '@tablerise/dynamic-logger';

describe('Get RPG system from database', () => {
    let model: MongoModel<DnDSystem>;
    const system = mocks.system.instance as DnDSystem & { _id: string };
    const { _id: _, ...systemPayload } = system;

    let documentId: string;

    beforeAll(() => {
        DatabaseManagement.connect(true)
            .then(() => { logger('info', 'Test database connection instanciated'); })
            .catch(() => { logger('error', 'Test database connection failed'); });

        const DM = new DatabaseManagement();
        model = DM.modelInstance('dungeons&dragons5e', 'System');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('When request all rpg systems', () => {
        it('should return an array with systems', async () => {
            const response = (await model.create(systemPayload)) as DnDSystem & { _id: string };
            documentId = response._id;

            const { body } = await requester.get('/dnd5e/system').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');
            expect(body[0]).toHaveProperty('name');
            expect(body[0]).toHaveProperty('content');
            expect(body[0]).toHaveProperty('references');
            expect(body[0]).toHaveProperty('active');
        });
    });

    describe('When request one rpg system', () => {
        it('should return a system instance', async () => {
            await model.create(systemPayload);

            const { body } = await requester.get(`/dnd5e/system/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');
            expect(body).toHaveProperty('name');
            expect(body).toHaveProperty('content');
            expect(body).toHaveProperty('references');
            expect(body).toHaveProperty('active');
            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail with id NotFound', async () => {
            const { body } = await requester
                .get(`/dnd5e/system/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
