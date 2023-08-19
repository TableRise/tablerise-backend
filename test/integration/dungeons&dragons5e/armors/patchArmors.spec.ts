import request from 'supertest';
import app from 'src/app';
import ArmorsModel from 'src/database/models/dungeons&dragons5e/ArmorsModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Armor } from 'src/schemas/dungeons&dragons5e/armorsValidationSchema';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Connections from 'src/database/DatabaseConnection';

describe('Patch RPG armors in database', () => {
    const model = new ArmorsModel();
    const armor = mocks.armor.instance as Internacional<Armor>;
    const { _id: _, ...armorPayload } = armor;

    let documentId: string;

    afterAll(async () => {
        await Connections['dungeons&dragons5e'].close();
    });

    describe('When update availability one rpg armor', () => {
        it('should return a string with armor updated id', async () => {
            const response = await model.create(armorPayload);
            documentId = response._id as string;

            const { body } = await request(app)
                .patch(`/dnd5e/armors/${documentId}?availability=false`)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe(`Armor ${documentId} was deactivated`);
            expect(body.name).toBe('success');
        });

        it('should fail when availability already enabled', async () => {
            const response = await model.create(armorPayload);
            documentId = response._id as string;

            const { body } = await request(app)
                .patch(`/dnd5e/armors/${documentId}?availability=true`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail when availability already disabled', async () => {
            await request(app).patch(`/dnd5e/armors/${documentId}?availability=false`);

            const { body } = await request(app)
                .patch(`/dnd5e/armors/${documentId}?availability=false`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail when query is wrong', async () => {
            const { body } = await request(app)
                .patch(`/dnd5e/armors/${documentId}?availability=wrongQuery`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('The query is invalid');
            expect(body.name).toBe('Invalid Entry');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .patch(`/dnd5e/armors/${generateNewMongoID()}?availability=false`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
