import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import GodsModel from 'src/database/models/GodsModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { God } from 'src/schemas/godsValidationSchema';
import mocks from 'src/support/mocks';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Delete RPG gods in database', () => {
  beforeAll(() => {
    connect();
  });

  afterAll(async () => {
    await close();
  });

  const model = new GodsModel();
  const god = mocks.god.instance as Internacional<God>;
  const { _id: _, ...godPayload } = god;

  let documentId: string;

  describe('When delete one rpg god', () => {
    it('should return 204 status with no content', async () => {
      const response = await model.create(godPayload);
      documentId = response._id as string;

      const { body } = await request(app)
        .delete(`/gods/${documentId}`)
        .expect(HttpStatusCode.DELETED);

      expect(body).toStrictEqual({});
    });

    it('should fail with inexistent ID', async () => {
      const { body } = await request(app)
        .delete(`/gods/${generateNewMongoID()}`)
        .expect(HttpStatusCode.NOT_FOUND);

      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('name');
      expect(body.message).toBe('NotFound a god with provided ID');
      expect(body.name).toBe('NotFound');
    });
  });
});
