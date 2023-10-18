import requester from '../../../support/requester';
import DatabaseManagement, { MongoModel } from '@tablerise/database-management';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

import { System } from 'src/schemas/dungeons&dragons5e/systemValidationSchema';

describe('Put RPG systems in database', () => {
    let model: MongoModel<System>;
    const system = mocks.system.instance as System & { _id: string };
    const { _id: _, ...systemPayload } = system;

    const newSystemPayload = { ...systemPayload, name: 'D&D', active: false };
    const { content: __, ...newSystemPayloadNoContent } = newSystemPayload;

    let documentId: string;

    beforeAll(() => {
        const database = new DatabaseManagement();
        model = database.modelInstance('dungeons&dragons5e', 'System');
    });

    describe('When update one rpg system', () => {
        it('should return updated system', async () => {
            const response = (await model.create(systemPayload)) as System & { _id: string };
            documentId = response._id;

            const { body } = await requester()
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
            const { body } = await requester()
                .put(`/dnd5e/system/${documentId}`)
                .send({ data: null } as unknown as System)
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('details');
            expect(body).toHaveProperty('name');
            expect(body.details[0].attribute).toBe('name');
            expect(body.details[0].reason).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail with content in payload', async () => {
            const { body } = await requester()
                .put(`/dnd5e/system/${generateNewMongoID()}`)
                .send(newSystemPayload)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await requester()
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
