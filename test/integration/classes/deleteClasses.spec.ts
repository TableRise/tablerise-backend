import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import ClassesModel from 'src/database/models/ClassesModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Class } from 'src/schemas/classesValidationSchema';
import mocks from 'src/support/mocks';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Delete RPG classes in database', () => {
  beforeAll(() => {
    connect();
  });

  afterAll(async () => {
    await close();
  });

  const model = new ClassesModel();
  const _class = mocks.class.instance as Internacional<Class>;
  const { _id: _, ...classPayload } = _class;

  let documentId: string;

  describe('When delete one rpg class', () => {
    it('should return 204 status with no content', async () => {
      const response = await model.create(classPayload);
      documentId = response._id as string;

      const { body } = await request(app)
        .delete(`/classes/${documentId}`)
        .expect(HttpStatusCode.DELETED);

      expect(body).toStrictEqual({});
    });

    it('should fail with inexistent ID', async () => {
      const { body } = await request(app)
        .delete(`/classes/${generateNewMongoID()}`)
        .expect(HttpStatusCode.NOT_FOUND);

      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('name');
      expect(body.message).toBe('NotFound a class with provided ID');
      expect(body.name).toBe('NotFound');
    });
  });
});
