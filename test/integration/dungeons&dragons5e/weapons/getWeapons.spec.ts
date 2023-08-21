import requester from '../../../support/requester';
import DatabaseManagement, { DnDWeapon, Internacional, mongoose, MongoModel } from '@tablerise/database-management';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

import logger from '@tablerise/dynamic-logger';

describe('Get RPG weapons from database', () => {
    let model: MongoModel<Internacional<DnDWeapon>>;
    const weapon = mocks.weapon.instance;
    const { _id: _, ...weaponMockPayload } = weapon as Internacional<DnDWeapon>;

    let documentId: string;

    beforeAll(() => {
        DatabaseManagement.connect(true)
            .then(() => { logger('info', 'Test database connection instanciated'); })
            .catch(() => { logger('error', 'Test database connection failed'); });

        const DM = new DatabaseManagement();
        model = DM.modelInstance('dungeons&dragons5e', 'Weapons');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('When request all rpg weapons', () => {
        it('should return an array with weapons', async () => {
            const keysToTest = ['name', 'description', 'cost', 'type', 'weight', 'damage', 'properties'];

            const response = await model.create(weaponMockPayload);
            documentId = response._id as string;

            const { body } = await requester.get('/dnd5e/weapons').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request all disabled rpg weapons', () => {
        it('should return an array with disabled weapons', async () => {
            const keysToTest = ['name', 'description', 'cost', 'type', 'weight', 'damage', 'properties'];

            const weaponMockCopy = {
                active: false,
                en: { ...weaponMockPayload.en, active: false },
                pt: { ...weaponMockPayload.pt, active: false },
            };

            const response = await model.create(weaponMockCopy);
            documentId = response._id as string;

            const { body } = await requester.get('/dnd5e/weapons/disabled').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request one rpg weapon', () => {
        it('should return a weapon instance', async () => {
            const keysToTest = ['name', 'description', 'cost', 'type', 'weight', 'damage', 'properties'];

            await model.create(weaponMockPayload);

            const { body } = await requester.get(`/dnd5e/weapons/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await requester
                .get(`/dnd5e/weapons/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
