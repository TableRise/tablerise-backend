import requester from '../../../support/requester';
import DatabaseManagement, { DnDSystem, UpdateContent, mongoose, MongoModel } from '@tablerise/database-management';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

const logger = require('@tablerise/dynamic-logger');

describe('Patch RPG systems in database', () => {
    let model: MongoModel<DnDSystem>;
    const contentPayload = mocks.updateSystemContent.instance as UpdateContent;

    const systemMockInstance = mocks.system.instance as DnDSystem & { _id: string };
    const { _id: __, ...systemMockPayload } = systemMockInstance;

    let documentId: string;

    beforeAll(() => {
        DatabaseManagement.connect(true)
            .then(() => logger('info', 'Test database connection instanciated'))
            .catch(() => logger('error', 'Test database connection failed'));

        const DM = new DatabaseManagement();
        model = DM.modelInstance('dungeons&dragons5e', 'System');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('When update the content of the rpg system', () => {
        it('should return successfull confirmation', async () => {
            const response = (await model.create(systemMockPayload)) as DnDSystem & { _id: string };
            documentId = response._id;

            const updateResult = `New ID ${contentPayload.newID as string} was ${
                contentPayload.method as string
            } to array of entities races - system ID: ${documentId}`;

            const { text } = await requester
                .patch(`/dnd5e/system/${documentId}?entity=races`)
                .send(contentPayload)
                .expect(HttpStatusCode.CREATED);

            expect(text).toBe(updateResult);
        });

        it('should fail when data is wrong', async () => {
            const { body } = await requester
                .patch(`/dnd5e/system/${documentId}?entity=races`)
                .send({ data: null })
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(JSON.parse(body.message)[0].path[0]).toBe('method');
            expect(JSON.parse(body.message)[0].message).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail when no entityData', async () => {
            const { body } = await requester
                .patch(`/dnd5e/system/${documentId}`)
                .send(contentPayload)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await requester
                .patch(`/dnd5e/system/${generateNewMongoID()}?entity=races`)
                .send(contentPayload)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
