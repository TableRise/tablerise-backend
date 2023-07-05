import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import SystemsModel from 'src/database/models/SystemsModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { System } from 'src/schemas/systemsValidationSchema';
import mocks from 'src/support/mocks';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Get RPG systems from database', () => {
  beforeAll(() => {
    connect();
  });

  afterAll(async () => {
    await close();
  });

  const model = new SystemsModel();
  const system = mocks.system.instance as System;
  const { _id: _, ...systemPayload } = system;

  let documentId: string;

  describe('When request all rpg systems', () => {
    it('should return an array with systems', async () => {
      const response = await model.create(systemPayload);
      documentId = response._id as string;

      const { body } = await request(app)
        .get('/systems')
        .expect(HttpStatusCode.OK);

      expect(body).toBeInstanceOf(Array);
      expect(body[0]).toHaveProperty('_id');
      expect(body[0]).toHaveProperty('name');
      expect(body[0]).toHaveProperty('content');
      expect(body[0]).toHaveProperty('references');
      expect(body[0]).toHaveProperty('active');
    });
  });

  describe('When request one rpg system', () => {
    it('should return a system instance', async () => {
      await model.create(systemPayload);

      const { body } = await request(app)
        .get(`/systems/${documentId}`)
        .expect(HttpStatusCode.OK);

      expect(body).toHaveProperty('_id');
      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('content');
      expect(body).toHaveProperty('references');
      expect(body).toHaveProperty('active');
      expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
    });

    it('should fail with id NotFound', async () => {
      const { body } = await request(app)
        .get(`/systems/${generateNewMongoID()}`)
        .expect(HttpStatusCode.NOT_FOUND);

      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('name');
      expect(body.message).toBe('NotFound a system with provided ID');
      expect(body.name).toBe('NotFound');
    });
  });
});
