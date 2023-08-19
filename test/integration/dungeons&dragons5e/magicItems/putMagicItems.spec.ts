import request from 'supertest';
import app from 'src/app';
import MagicItemsModel from 'src/database/models/dungeons&dragons5e/MagicItemsModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { MagicItem } from 'src/schemas/dungeons&dragons5e/magicItemsValidationSchema';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Connections from 'src/database/DatabaseConnection';

describe('Put RPG magic items in database', () => {
    const model = new MagicItemsModel();
    const magicItem = mocks.magicItems.instance as Internacional<MagicItem>;
    const { _id: _, ...magicItemPayload } = magicItem;

    const newMagicItemPayload = {
        en: { ...magicItemPayload.en, name: 'Olympo' },
        pt: { ...magicItemPayload.pt, name: 'Olympo' },
    };

    let documentId: string;

    afterAll(async () => {
        await Connections['dungeons&dragons5e'].close();
    });

    describe('When update one rpg magic item', () => {
        it('should return updated magic item', async () => {
            const keysToTest = ['name', 'characteristics', 'description'];

            const response = await model.create(magicItemPayload);
            documentId = response._id as string;

            const { body } = await request(app)
                .put(`/dnd5e/magicItems/${documentId}`)
                .send(newMagicItemPayload)
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
                .put(`/dnd5e/magicItems/${documentId}`)
                .send({ data: null } as unknown as Internacional<MagicItem>)
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(JSON.parse(body.message)[0].path[0]).toBe('en');
            expect(JSON.parse(body.message)[0].message).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail when try to change availability', async () => {
            const { body } = await request(app)
                .put(`/dnd5e/magicItems/${generateNewMongoID()}`)
                .send({ active: true, ...newMagicItemPayload })
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .put(`/dnd5e/magicItems/${generateNewMongoID()}`)
                .send(newMagicItemPayload)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
