import requester from '../../../support/requester';
import DatabaseManagement, { DnDSystem, mongoose, MongoModel } from '@tablerise/database-management';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

import logger from '@tablerise/dynamic-logger';

describe('Patch RPG system status in database', () => {
    let model: MongoModel<DnDSystem>;
    const systemMockInstance = mocks.system.instance as DnDSystem & { _id: string };
    const { _id: __, ...systemMockPayload } = systemMockInstance;

    let documentId: string;

    beforeAll(() => {
        DatabaseManagement.connect(true)
            .then(() => {
                logger('info', 'Test database connection instanciated');
            })
            .catch(() => {
                logger('error', 'Test database connection failed');
            });

        const DM = new DatabaseManagement();
        model = DM.modelInstance('dungeons&dragons5e', 'System');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('When toggle the status of the rpg system to active', () => {
        it('should return a string with updated system id', async () => {
            const response = (await model.create(systemMockPayload)) as DnDSystem & { _id: string };
            documentId = response._id;

            const { body } = await requester
                .patch(`/dnd5e/system/${documentId}?aviability=false`)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe(`System ${documentId} was deactivated`);
            expect(body.name).toBe('success');
        });

        it('should fail when availability already enabled', async () => {
            const response = (await model.create(systemMockPayload)) as DnDSystem & { _id: string };
            documentId = response._id;

            const { body } = await requester
                .patch(`/dnd5e/system/${documentId}?aviability=false`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail when availability already disabled', async () => {
            await requester.patch(`/dnd5e/system/${documentId}?availability=false`);

            const { body } = await requester
                .patch(`/dnd5e/system/${documentId}?availability=false`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail when query is wrong', async () => {
            const { body } = await requester
                .patch(`/dnd5e/system/${documentId}?availability=wrongQuery`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('The query is invalid');
            expect(body.name).toBe('Invalid Entry');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await requester
                .patch(`/dnd5e/system/${generateNewMongoID()}?availability=false`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
