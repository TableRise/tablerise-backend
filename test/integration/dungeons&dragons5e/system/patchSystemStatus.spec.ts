import requester from '../../../support/requester';
import DatabaseManagement, { DnDSystem, mongoose, MongoModel } from '@tablerise/database-management';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

import logger from '@tablerise/dynamic-logger';

describe('Patch RPG system status in database', () => {
    let model: MongoModel<System>;
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

    const updateResult = (id: string, action: number): string =>
        `System ${id} was ${action === 1 ? 'activated' : 'deactivated'}`;

    describe('When toggle the status of the rpg system to active', () => {
        it('should return successfull confirmation', async () => {
            const systemMockPayloadNoActive = {
                ...systemMockPayload,
                active: false,
            };
            const response = (await model.create(systemMockPayloadNoActive)) as DnDSystem & { _id: string };
            documentId = response._id;

            const { text } = await requester.patch(`/dnd5e/system/activate/${documentId}`).expect(HttpStatusCode.OK);

            expect(text).toBe(updateResult(documentId, 1));
        });

        it('should fail when is already active', async () => {
            const response = (await model.create(systemMockPayload)) as DnDSystem & { _id: string };
            documentId = response._id;

            const { body } = await requester
                .patch(`/dnd5e/system/activate/${documentId}`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await requester
                .patch(`/dnd5e/system/activate/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });

    describe('When toggle the status of the rpg system to deactivated', () => {
        it('should return successfull confirmation', async () => {
            const response = (await model.create(systemMockPayload)) as DnDSystem & { _id: string };
            documentId = response._id;

            const { text } = await requester.patch(`/dnd5e/system/deactivate/${documentId}`).expect(HttpStatusCode.OK);

            expect(text).toBe(updateResult(documentId, 0));
        });

        it('should fail when is already deactivated', async () => {
            const systemMockPayloadNoActive = {
                ...systemMockPayload,
                active: false,
            };
            const response = (await model.create(systemMockPayloadNoActive)) as DnDSystem & { _id: string };
            documentId = response._id;

            const { body } = await requester
                .patch(`/dnd5e/system/deactivate/${documentId}`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await requester
                .patch(`/dnd5e/system/deactivate/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
