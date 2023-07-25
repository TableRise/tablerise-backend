import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import ArmorsModel from 'src/database/models/ArmorsModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Armor } from 'src/schemas/armorsValidationSchema';
import mocks from 'src/support/mocks';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe.skip('Delete RPG armors in database', () => {
  beforeAll(() => {
    connect();
  });

  afterAll(async () => {
    await close();
  });

  const model = new ArmorsModel();
  const armor = mocks.armor.instance as Internacional<Armor>;
  const { _id: _, ...armorPayload } = armor;

  let documentId: string;

  describe('When delete one rpg armor', () => {
    it('should return 204 status with no content', async () => {
      const response = await model.create(armorPayload);
      documentId = response._id as string;

      const { body } = await request(app)
        .delete(`/armors/${documentId}`)
        .expect(HttpStatusCode.DELETED);

      expect(body).toStrictEqual({});
    });

    it('should fail with inexistent ID', async () => {
      const { body } = await request(app)
        .delete(`/armors/${generateNewMongoID()}`)
        .expect(HttpStatusCode.NOT_FOUND);

      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('name');
      expect(body.message).toBe('NotFound an armor with provided ID');
      expect(body.name).toBe('NotFound');
    });
  });
});
