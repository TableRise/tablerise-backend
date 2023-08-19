import request from 'supertest';
import app from 'src/app';
import ArmorsModel from 'src/database/models/dungeons&dragons5e/ArmorsModel';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Armor } from 'src/schemas/dungeons&dragons5e/armorsValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Connections from 'src/database/DatabaseConnection';

describe('Get RPG armors from database', () => {
    const model = new ArmorsModel();
    const armor = mocks.armor.instance;
    const { _id: _, ...armorMockPayload } = armor as Internacional<Armor>;

    let documentId: string;

    afterAll(async () => {
        await Connections['dungeons&dragons5e'].close();
    });

    describe('When request all rpg armors', () => {
        it('should return an array with armors', async () => {
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

            const response = await model.create(armorMockPayload);
            documentId = response._id as string;

            const { body } = await request(app).get('/dnd5e/armors').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request all disabled rpg armors', () => {
        it('should return an array with disabled armors', async () => {
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

            const armorMockCopy = {
                active: false,
                en: { ...armorMockPayload.en, active: false },
                pt: { ...armorMockPayload.pt, active: false },
            };

            const response = await model.create(armorMockCopy);
            documentId = response._id as string;

            const { body } = await request(app).get('/dnd5e/armors/disabled').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request one rpg armor', () => {
        it('should return a armor instance', async () => {
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

            await model.create(armorMockPayload);

            const { body } = await request(app).get(`/dnd5e/armors/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await request(app)
                .get(`/dnd5e/armors/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
