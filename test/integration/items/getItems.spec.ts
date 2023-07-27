import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import ItemsModel from 'src/database/models/ItemsModel';
import mocks from 'src/support/mocks';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Item } from 'src/schemas/itemsValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Get RPG Items from database', () => {
    beforeAll(() => {
        connect();
    });

    afterAll(async () => {
        await close();
    });

    const model = new ItemsModel();
    const item = mocks.item.instance as Internacional<Item>;
    const { _id: _, ...itemMockPayload } = item;

    let documentId: string;

    describe('When request all rpg Items', () => {
        it('should return an array with Items', async () => {
            const keysToTest = Object.keys(item.en);

            const response = await model.create(itemMockPayload);

            documentId = response._id as string;

            const { body } = await request(app).get('/items').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request one rpg Item', () => {
        it('should return a Item instance', async () => {
            const keysToTest = Object.keys(item.en);

            await model.create(itemMockPayload);

            const { body } = await request(app).get(`/items/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await request(app).get(`/items/${generateNewMongoID()}`).expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a Item with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
