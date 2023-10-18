import requester from '../../../support/requester';
import DatabaseManagement, { MongoModel, mongoose } from '@tablerise/database-management';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

import { System } from 'src/schemas/dungeons&dragons5e/systemValidationSchema';
import { UpdateContent } from 'src/schemas/updateContentSchema';
import logger from '@tablerise/dynamic-logger';

describe('Patch RPG systems in database', () => {
    let model: MongoModel<System>;
    const contentPayload = mocks.updateSystemContent.instance as UpdateContent;

    const systemMockInstance = mocks.system.instance as System & { _id: string };
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

        const database = new DatabaseManagement();
        model = database.modelInstance('dungeons&dragons5e', 'System');
    });

    afterAll(async() => {
        await mongoose.connection.close();
    });

    describe('When update the content of the rpg system', () => {
        it('should return successfull confirmation', async () => {
            const response = (await model.create(systemMockPayload)) as System & { _id: string };
            documentId = response._id;

            const updateResult = `New ID ${contentPayload.newID} was ${
                contentPayload.method as string
            } to array of entities races - system ID: ${documentId}`;

            const { text } = await requester()
                .patch(`/dnd5e/system/content/${documentId}?entity=races`)
                .send(contentPayload)
                .expect(HttpStatusCode.CREATED);

            expect(text).toBe(updateResult);
        });

        it('should fail when data is wrong', async () => {
            const { body } = await requester()
                .patch(`/dnd5e/system/content/${documentId}?entity=races`)
                .send({ data: null })
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.details[0].attribute).toBe('method');
            expect(body.details[0].reason).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail when no entityData', async () => {
            const { body } = await requester()
                .patch(`/dnd5e/system/content/${documentId}`)
                .send(contentPayload)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await requester()
                .patch(`/dnd5e/system/content/${generateNewMongoID()}?entity=races`)
                .send(contentPayload)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
