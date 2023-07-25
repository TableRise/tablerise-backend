import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import FeatsModel from 'src/database/models/FeatsModel';
import mocks from 'src/support/mocks';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Feat } from 'src/schemas/featsValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe.skip('Get RPG feats from database', () => {
  beforeAll(() => {
    connect();
  });

  afterAll(async () => {
    await close();
  });

  const model = new FeatsModel();
  const feat = mocks.feat.instance;
  const { _id: _, ...featMockPayload } = feat as Internacional<Feat>;

  let documentId: string;

  describe('When request all rpg feats', () => {
    it('should return an array with feats', async () => {
      const keysToTest = ['name', 'prerequisite', 'description', 'benefits'];

      const response = await model.create(featMockPayload);
      documentId = response._id as string;

      const { body } = await request(app)
        .get('/feats')
        .expect(HttpStatusCode.OK);

      expect(body).toBeInstanceOf(Array);
      expect(body[0]).toHaveProperty('_id');

      keysToTest.forEach((key) => {
        expect(body[0].en).toHaveProperty(key);
        expect(body[0].pt).toHaveProperty(key);
      });
    });
  });

  describe('When request one rpg feat', () => {
    it('should return a feat instance', async () => {
      const keysToTest = ['name', 'prerequisite', 'description', 'benefits'];

      await model.create(featMockPayload);

      const { body } = await request(app)
        .get(`/feats/${documentId}`)
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
        .get(`/feats/${generateNewMongoID()}`)
        .expect(HttpStatusCode.NOT_FOUND);

      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('name');
      expect(body.message).toBe('NotFound a feat with provided ID');
      expect(body.name).toBe('NotFound');
    });
  });
});
