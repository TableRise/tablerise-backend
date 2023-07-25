import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import ItemsModel from 'src/database/models/ItemsModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Item } from 'src/schemas/itemsValidationSchema';
import mocks from 'src/support/mocks';
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
    pt: { ...itemPayload.pt, name: 'Item_testPut' }
  }

  let documentId: string;

  describe('When update one rpg Item', () => {
    it('should return updated Item', async () => {
      const keysToTest = Object.keys(item.en)
      console.log("L34 => \n", keysToTest)
      const response = await model.create(itemPayload);
      documentId = response._id as string;
      console.log('\L37', response)
      const { body } = await request(app)
        .put(`/items/${documentId}`)
        .send(newItemPayload)
        .expect(HttpStatusCode.OK);

      expect(body).toHaveProperty('_id');

      keysToTest.forEach((key) => {
        expect(body.en).toHaveProperty(key);
        expect(body.pt).toHaveProperty(key);
      });

      expect(body.en.name).toBe('Item_testPut');
      expect(body.pt.name).toBe('Item_testPut');
      console.log('>>', body.en.name)
      console.log('>>', body.pt.name)
    });

    it('should fail when data is wrong', async () => {
      const { body } = await request(app)
        .put(`/items/${documentId}`)
        .send({ data: null } as unknown as Internacional<Item>)
        .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('name');
      expect(JSON.parse(body.message)[0].path[0]).toBe('en');
      expect(JSON.parse(body.message)[0].message).toBe('Required');
      expect(body.name).toBe('ValidationError');
    });

    it('should fail with inexistent ID', async () => {
      const { body } = await request(app)
        .put(`/items/${generateNewMongoID()}`)
        .send(newItemPayload)
        .expect(HttpStatusCode.NOT_FOUND);

      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('name');
      expect(body.message).toBe('NotFound a Item with provided ID');
      expect(body.name).toBe('NotFound');
    });
  });
});
