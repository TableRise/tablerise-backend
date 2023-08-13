import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../../connectDatabaseTest';
import ItemsModel from 'src/database/models/dungeons&dragons5e/ItemsModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Item } from 'src/schemas/dungeons&dragons5e/itemsValidationSchema';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Put RPG Items in database', () => {
    beforeAll(() => {
        connect();
    });

    afterAll(async () => {
        await close();
    });

    const model = new ItemsModel();
    const item = mocks.item.instance as Internacional<Item>;
    const { _id: _, ...itemPayload } = item;

    const newItemPayload = {
        en: { ...itemPayload.en, name: 'Item_testPut' },
        pt: { ...itemPayload.pt, name: 'Item_testPut' },
    };

    let documentId: string;

    describe('When update one rpg Item', () => {
        it('should return updated Item', async () => {
            const keysToTest = Object.keys(item.en);

            const response = await model.create(itemPayload);
            documentId = response._id as string;

            const { body } = await request(app)
                .put(`/dnd5e/items/${documentId}`)
                .send(newItemPayload)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(body.en.name).toBe('Item_testPut');
            expect(body.pt.name).toBe('Item_testPut');
        });

        it('should fail when data is wrong', async () => {
            const { body } = await request(app)
                .put(`/dnd5e/items/${documentId}`)
                .send({ data: null } as unknown as Internacional<Item>)
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(JSON.parse(body.message)[0].path[0]).toBe('en');
            expect(JSON.parse(body.message)[0].message).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail when try to change availability', async () => {
            const { body } = await request(app)
                .put(`/dnd5e/items/${generateNewMongoID()}`)
                .send({ active: true, ...newItemPayload })
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .put(`/dnd5e/items/${generateNewMongoID()}`)
                .send(newItemPayload)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an item with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
