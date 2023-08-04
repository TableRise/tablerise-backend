import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import ArmorsModel from 'src/database/models/ArmorsModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Armor } from 'src/schemas/armorsValidationSchema';
import mocks from 'src/support/mocks';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Put RPG armors in database', () => {
    beforeAll(() => {
        connect();
    });

    afterAll(async () => {
        await close();
    });

    const model = new ArmorsModel();
    const armor = mocks.armor.instance as Internacional<Armor>;
    const { _id: _, ...armorPayload } = armor;

    const newArmorPayload = {
        en: { ...armorPayload.en, name: 'Olympo' },
        pt: { ...armorPayload.pt, name: 'Olympo' },
    };

    let documentId: string;

    describe('When update one rpg armor', () => {
        it('should return updated armor', async () => {
            const keysToTest = [
                'name',
                'description',
                'cost',
                'type',
                'weight',
                'armorClass',
                'requiredStrength',
                'stealthPenalty',
            ];

            const response = await model.create(armorPayload);
            documentId = response._id as string;

            const { body } = await request(app)
                .put(`/armors/${documentId}`)
                .send(newArmorPayload)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(body.en.name).toBe('Olympo');
            expect(body.pt.name).toBe('Olympo');
        });

        it('should fail when data is wrong', async () => {
            const { body } = await request(app)
                .put(`/armors/${documentId}`)
                .send({ data: null } as unknown as Internacional<Armor>)
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(JSON.parse(body.message)[0].path[0]).toBe('en');
            expect(JSON.parse(body.message)[0].message).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail when try to change availability', async () => {
            const { body } = await request(app)
                .put(`/armors/${generateNewMongoID()}`)
                .send({ active: true, ...newArmorPayload })
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .put(`/armors/${generateNewMongoID()}`)
                .send(newArmorPayload)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an armor with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
