import request from 'supertest';
import app from 'src/app';
import WeaponsModel from 'src/database/models/dungeons&dragons5e/WeaponsModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Weapon } from 'src/schemas/dungeons&dragons5e/weaponsValidationSchema';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Connections from 'src/database/DatabaseConnection';

describe('Put RPG weapons in database', () => {
    const model = new WeaponsModel();
    const weapon = mocks.weapon.instance as Internacional<Weapon>;
    const { _id: _, ...weaponPayload } = weapon;

    const newWeaponPayload = {
        en: { ...weaponPayload.en, name: 'Olympo' },
        pt: { ...weaponPayload.pt, name: 'Olympo' },
    };

    let documentId: string;

    afterAll(async () => {
        await Connections['dungeons&dragons5e'].close();
    });

    describe('When update one rpg weapon', () => {
        it('should return updated weapon', async () => {
            const keysToTest = ['name', 'description', 'cost', 'type', 'weight', 'damage', 'properties'];

            const response = await model.create(weaponPayload);
            documentId = response._id as string;

            const { body } = await request(app)
                .put(`/dnd5e/weapons/${documentId}`)
                .send(newWeaponPayload)
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
                .put(`/dnd5e/weapons/${documentId}`)
                .send({ data: null } as unknown as Internacional<Weapon>)
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(JSON.parse(body.message)[0].path[0]).toBe('en');
            expect(JSON.parse(body.message)[0].message).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail when try to change availability', async () => {
            const { body } = await request(app)
                .put(`/dnd5e/weapons/${generateNewMongoID()}`)
                .send({ active: true, ...newWeaponPayload })
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .put(`/dnd5e/weapons/${generateNewMongoID()}`)
                .send(newWeaponPayload)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a weapon with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});