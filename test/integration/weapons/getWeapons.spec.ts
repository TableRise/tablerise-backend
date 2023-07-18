import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import WeaponsModel from 'src/database/models/WeaponsModel';
import mocks from 'src/support/mocks';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Weapon } from 'src/schemas/weaponsValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Get RPG weapons from database', () => {
  beforeAll(() => {
    connect();
  });

  afterAll(async () => {
    await close();
  });

  const model = new WeaponsModel();
  const weapon = mocks.weapon.instance;
  const { _id: _, ...weaponMockPayload } = weapon as Internacional<Weapon>;

  let documentId: string;

  describe('When request all rpg weapons', () => {
    it('should return an array with weapons', async () => {
      const keysToTest = ['name', 'description', 'cost', 'type', 'weight', 'damage', 'properties'];

      const response = await model.create(weaponMockPayload);
      documentId = response._id as string;

      const { body } = await request(app)
        .get('/weapons')
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
      const keysToTest = ['name', 'description', 'cost', 'type', 'weight', 'damage', 'properties'];

      await model.create(weaponMockPayload);

      const { body } = await request(app)
        .get(`/weapons/${documentId}`)
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
        .get(`/weapons/${generateNewMongoID()}`)
        .expect(HttpStatusCode.NOT_FOUND);

      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('name');
      expect(body.message).toBe('NotFound a weapon with provided ID');
      expect(body.name).toBe('NotFound');
    });
  });
});
