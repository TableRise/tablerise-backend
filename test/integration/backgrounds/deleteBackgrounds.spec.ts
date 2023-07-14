import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import BackgroundsModel from 'src/database/models/BackgroundsModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Background } from 'src/schemas/backgroundsValidationSchema';
import mocks from 'src/support/mocks';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Delete RPG backgrounds in database', () => {
  beforeAll(() => {
    connect();
  });

  afterAll(async () => {
    await close();
  });

  const model = new BackgroundsModel();
  const background = mocks.background.instance as Internacional<Background>;
  const { _id: _, ...backgroundPayload } = background;

  let documentId: string;

  describe('When delete one rpg background', () => {
    it('should return 204 status with no content', async () => {
      const response = await model.create(backgroundPayload);
      documentId = response._id as string;

      const { body } = await request(app)
        .delete(`/backgrounds/${documentId}`)
        .expect(HttpStatusCode.DELETED);

      expect(body).toStrictEqual({});
    });

    it('should fail with inexistent ID', async () => {
      const { body } = await request(app)
        .delete(`/backgrounds/${generateNewMongoID()}`)
        .expect(HttpStatusCode.NOT_FOUND);

      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('name');
      expect(body.message).toBe('NotFound a background with provided ID');
      expect(body.name).toBe('NotFound');
    });
  });
});
