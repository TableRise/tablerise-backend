import requester from '../../../support/requester';
import DatabaseManagement, { DnDSystem, mongoose, MongoModel } from '@tablerise/database-management';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

import logger from '@tablerise/dynamic-logger';

describe('Put RPG systems in database', () => {
    let model: MongoModel<DnDSystem>;
    const system = mocks.system.instance as DnDSystem & { _id: string };
    const { _id: _, ...systemPayload } = system;

    const newSystemPayload = { ...systemPayload, name: 'D&D', active: false };
    const { content: __, ...newSystemPayloadNoContent } = newSystemPayload;

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

    describe('When update one rpg system', () => {
        it('should return updated system', async () => {
            const response = (await model.create(systemPayload)) as DnDSystem & { _id: string };
            documentId = response._id;

            const { body } = await requester
                .put(`/dnd5e/system/${documentId}`)
                .send(newSystemPayloadNoContent)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');
            expect(body).toHaveProperty('name');
            expect(body).toHaveProperty('active');
            expect(body.name).toBe('D&D');
            expect(body.active).toBe(false);
        });

        it('should fail when data is wrong', async () => {
            const { body } = await requester
                .put(`/dnd5e/system/${documentId}`)
                .send({ data: null } as unknown as DnDSystem)
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(JSON.parse(body.message)[0].path[0]).toBe('name');
            expect(JSON.parse(body.message)[0].message).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail with content in payload', async () => {
            const { body } = await requester
                .put(`/dnd5e/system/${generateNewMongoID()}`)
                .send(newSystemPayload)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await requester
                .put(`/dnd5e/system/${generateNewMongoID()}`)
                .send(newSystemPayloadNoContent)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
