import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import ItemsModel from 'src/database/models/ItemsModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Item } from 'src/schemas/itemsValidationSchema';
import mocks from 'src/support/mocks';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Delete RPG Items in database', () => {
    beforeAll(() => {
        connect();
    });

    afterAll(async () => {
        await close();
    });

    const model = new ItemsModel();
    const Item = mocks.item.instance as Internacional<Item>;
    const { _id: _, ...ItemPayload } = Item;

    let documentId: string;

    describe('When delete one rpg Item', () => {
        it('should return 204 status with no content', async () => {
            const response = await model.create(ItemPayload);
            documentId = response._id as string;

            const { body } = await request(app).delete(`/items/${documentId}`).expect(HttpStatusCode.DELETED);

            expect(body).toStrictEqual({});
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .delete(`/items/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an item with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
