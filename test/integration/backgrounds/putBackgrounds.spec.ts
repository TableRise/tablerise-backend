import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import BackgroundsModel from 'src/database/models/BackgroundsModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Background } from 'src/schemas/backgroundsValidationSchema';
import mocks from 'src/support/mocks';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe.skip('Put RPG backgrounds in database', () => {
  beforeAll(() => {
    connect();
  });

  afterAll(async () => {
    await close();
  });

  const model = new BackgroundsModel();
  const background = mocks.background.instance as Internacional<Background>;
  const { _id: _, ...backgroundPayload } = background;

  const newBackgroundPayload = {
    en: { ...backgroundPayload.en, name: 'Warrior' },
    pt: { ...backgroundPayload.pt, name: 'Warrior' }
  }

  let documentId: string;

  describe('When update one rpg background', () => {
    it('should return updated background', async () => {
      const keysToTest = ['name', 'description', 'skillProficiences', 'languages', 'equipment', 'characteristics'];

      const response = await model.create(backgroundPayload);
      documentId = response._id as string;

      const { body } = await request(app)
        .put(`/backgrounds/${documentId}`)
        .send(newBackgroundPayload)
        .expect(HttpStatusCode.OK);

      expect(body).toHaveProperty('_id');

      keysToTest.forEach((key) => {
        expect(body.en).toHaveProperty(key);
        expect(body.pt).toHaveProperty(key);
      });

      expect(body.en.name).toBe('Warrior');
      expect(body.pt.name).toBe('Warrior');
    });

    it('should fail when data is wrong', async () => {
      const { body } = await request(app)
        .put(`/backgrounds/${documentId}`)
        .send({ data: null } as unknown as Internacional<Background>)
        .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('name');
      expect(JSON.parse(body.message)[0].path[0]).toBe('en');
      expect(JSON.parse(body.message)[0].message).toBe('Required');
      expect(body.name).toBe('ValidationError');
    });

    it('should fail with inexistent ID', async () => {
      const { body } = await request(app)
        .put(`/backgrounds/${generateNewMongoID()}`)
        .send(newBackgroundPayload)
        .expect(HttpStatusCode.NOT_FOUND);

      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('name');
      expect(body.message).toBe('NotFound a background with provided ID');
      expect(body.name).toBe('NotFound');
    });
  });
});
