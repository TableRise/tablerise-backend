import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import BackgroundsModel from 'src/database/models/BackgroundsModel';
import mocks from 'src/support/mocks';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Background } from 'src/schemas/backgroundsValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe.skip('Get RPG backgrounds from database', () => {
  beforeAll(() => {
    connect();
  });

  afterAll(async () => {
    await close();
  });

  const model = new BackgroundsModel();
  const background = mocks.background.instance;
  const { _id: _, ...backgroundMockPayload } = background as Internacional<Background>;

  let documentId: string;

  describe('When request all rpg backgrounds', () => {
    it('should return an array with backgrounds', async () => {
      const keysToTest = ['name', 'description', 'skillProficiences', 'languages', 'equipment', 'characteristics'];

      const response = await model.create(backgroundMockPayload);
      documentId = response._id as string;

      const { body } = await request(app)
        .get('/backgrounds')
        .expect(HttpStatusCode.OK);

      expect(body).toBeInstanceOf(Array);
      expect(body[0]).toHaveProperty('_id');

      keysToTest.forEach((key) => {
        expect(body[0].en).toHaveProperty(key);
        expect(body[0].pt).toHaveProperty(key);
      });
    });
  });

  describe('When request one rpg background', () => {
    it('should return a background instance', async () => {
      const keysToTest = ['name', 'description', 'skillProficiences', 'languages', 'equipment', 'characteristics'];

      await model.create(backgroundMockPayload);

      const { body } = await request(app)
        .get(`/backgrounds/${documentId}`)
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
        .get(`/backgrounds/${generateNewMongoID()}`)
        .expect(HttpStatusCode.NOT_FOUND);

      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('name');
      expect(body.message).toBe('NotFound a background with provided ID');
      expect(body.name).toBe('NotFound');
    });
  });
});
