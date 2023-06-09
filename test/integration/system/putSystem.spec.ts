import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import SystemsModel from 'src/database/models/SystemModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { System } from 'src/schemas/systemValidationSchema';
import mocks from 'src/support/mocks';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Put RPG systems in database', () => {
  beforeAll(() => {
    connect();
  });

  afterAll(async () => {
    await close();
  });

  const model = new SystemsModel();
  const system = mocks.system.instance as System;
  const { _id: _, ...systemPayload } = system;

  const newSystemPayload = { ...systemPayload, name: 'D&D', active: false }
  const { content: __, ...newSystemPayloadNoContent } = newSystemPayload;

  let documentId: string;

  describe('When update one rpg system', () => {
    it('should return updated system', async () => {
      const response = await model.create(systemPayload);
      documentId = response._id as string;

      const { body } = await request(app)
        .put(`/system/${documentId}`)
        .send(newSystemPayloadNoContent)
        .expect(HttpStatusCode.OK);

      expect(body).toHaveProperty('_id');
      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('active');
      expect(body.name).toBe('D&D');
      expect(body.active).toBe(false);
    });

    it('should fail when data is wrong', async () => {
      const { body } = await request(app)
        .put(`/system/${documentId}`)
        .send({ data: null } as unknown as System)
        .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('name');
      expect(JSON.parse(body.message)[0].path[0]).toBe('name');
      expect(JSON.parse(body.message)[0].message).toBe('Required');
      expect(body.name).toBe('ValidationError');
    });

    it('should fail with content in payload', async () => {
      const { body } = await request(app)
        .put(`/system/${generateNewMongoID()}`)
        .send(newSystemPayload)
        .expect(HttpStatusCode.FORBIDDEN);

      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('name');
      expect(body.message).toBe('Update the content directly is not allowed');
      expect(body.name).toBe('ForbiddenRequest');
    });

    it('should fail with inexistent ID', async () => {
      const { body } = await request(app)
        .put(`/system/${generateNewMongoID()}`)
        .send(newSystemPayloadNoContent)
        .expect(HttpStatusCode.NOT_FOUND);

      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('name');
      expect(body.message).toBe('NotFound a system with provided ID');
      expect(body.name).toBe('NotFound');
    });
  });
});
