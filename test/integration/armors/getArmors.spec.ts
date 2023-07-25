import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import ArmorsModel from 'src/database/models/ArmorsModel';
import mocks from 'src/support/mocks';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Armor } from 'src/schemas/armorsValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe.skip('Get RPG armors from database', () => {
  beforeAll(() => {
    connect();
  });

  afterAll(async () => {
    await close();
  });

  const model = new ArmorsModel();
  const armor = mocks.armor.instance;
  const { _id: _, ...armorMockPayload } = armor as Internacional<Armor>;

  let documentId: string;

  describe('When request all rpg armors', () => {
    it('should return an array with armors', async () => {
      const keysToTest = ['name', 'description', 'cost', 'type', 'weight', 'armorClass', 'requiredStrength', 'stealthPenalty'];

      const response = await model.create(armorMockPayload);
      documentId = response._id as string;

      const { body } = await request(app)
        .get('/armors')
        .expect(HttpStatusCode.OK);

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
      const keysToTest = ['name', 'description', 'cost', 'type', 'weight', 'armorClass', 'requiredStrength', 'stealthPenalty'];

      await model.create(armorMockPayload);

      const { body } = await request(app)
        .get(`/armors/${documentId}`)
        .expect(HttpStatusCode.OK);

      expect(body).toHaveProperty('_id');

      keysToTest.forEach((key) => {
        expect(body.en).toHaveProperty(key);
        expect(body.pt).toHaveProperty(key);
      });

      expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
    });

    it('should fail when ID NotFound', async () => {
      const { body } = await request(app)
        .get(`/armors/${generateNewMongoID()}`)
        .expect(HttpStatusCode.NOT_FOUND);

      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('name');
      expect(body.message).toBe('NotFound an armor with provided ID');
      expect(body.name).toBe('NotFound');
    });
  });
});
