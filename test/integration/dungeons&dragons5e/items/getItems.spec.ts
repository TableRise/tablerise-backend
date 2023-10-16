import requester from '../../../support/requester';
import DatabaseManagement, { mongoose, MongoModel } from '@tablerise/database-management';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

import logger from '@tablerise/dynamic-logger';
import { Item } from 'src/schemas/dungeons&dragons5e/itemsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

describe('Get RPG Items from database', () => {
    let model: MongoModel<Internacional<Item>>;
    const item = mocks.item.instance as Internacional<Item>;
    const { _id: _, ...itemMockPayload } = item;

    let documentId: string;

    beforeAll(() => {
        DatabaseManagement.connect(true)
            .then(() => {
                logger('info', 'Test database connection instanciated');
            })
            .catch(() => {
                logger('error', 'Test database connection failed');
            });

        const database = new DatabaseManagement();
        model = database.modelInstance('dungeons&dragons5e', 'Items');
        requester.set('Authorization', 'Bearer test');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('When request all rpg Items', () => {
        it('should return an array with Items', async () => {
            const keysToTest = Object.keys(item.en);

            const response = await model.create(itemMockPayload);

            documentId = response._id as string;

            const { body } = await requester.get('/dnd5e/items').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request all disabled rpg monsters', () => {
        it('should return an array with disabled monsters', async () => {
            const keysToTest = Object.keys(item.en);

            const itemMockCopy = {
                active: false,
                en: { ...itemMockPayload.en, active: false },
                pt: { ...itemMockPayload.pt, active: false },
            };

            const response = await model.create(itemMockCopy);
            documentId = response._id as string;

            const { body } = await requester.get('/dnd5e/items/disabled').expect(HttpStatusCode.OK);

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

            const { body } = await requester.get(`/dnd5e/items/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await requester
                .get(`/dnd5e/items/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
