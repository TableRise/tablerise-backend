import requester from '../../../support/requester';
import DatabaseManagement, { DnDWeapon, Internacional, mongoose, MongoModel } from '@tablerise/database-management';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

import logger from '@tablerise/dynamic-logger';

describe('Patch RPG weapons in database', () => {
    let model: MongoModel<Internacional<Weapon>>;
    const weapon = mocks.weapon.instance as Internacional<Weapon>;
    const { _id: _, ...weaponPayload } = weapon;

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
        model = DM.modelInstance('dungeons&dragons5e', 'Weapons');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('When update availability one rpg weapon', () => {
        it('should return a string with weapon updated id', async () => {
            const response = await model.create(weaponPayload);
            documentId = response._id as string;

            const { body } = await requester
                .patch(`/dnd5e/weapons/${documentId}?availability=false`)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe(`Weapon ${documentId} was deactivated`);
            expect(body.name).toBe('success');
        });

        it('should fail when availability already enabled', async () => {
            const response = await model.create(weaponPayload);
            documentId = response._id as string;

            const { body } = await requester
                .patch(`/dnd5e/weapons/${documentId}?availability=true`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail when availability already disabled', async () => {
            await requester.patch(`/dnd5e/weapons/${documentId}?availability=false`);

            const { body } = await requester
                .patch(`/dnd5e/weapons/${documentId}?availability=false`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail when query is wrong', async () => {
            const { body } = await requester
                .patch(`/dnd5e/weapons/${documentId}?availability=wrongQuery`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('The query is invalid');
            expect(body.name).toBe('Invalid Entry');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await requester
                .patch(`/dnd5e/weapons/${generateNewMongoID()}?availability=false`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
