import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import WeaponsModel from 'src/database/models/WeaponsModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Weapon } from 'src/schemas/weaponsValidationSchema';
import mocks from 'src/support/mocks';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Delete RPG weapons in database', () => {
  beforeAll(() => {
    connect();
  });

  afterAll(async () => {
    await close();
  });

  const model = new WeaponsModel();
  const weapon = mocks.weapon.instance as Internacional<Weapon>;
  const { _id: _, ...weaponPayload } = weapon;

  let documentId: string;

  describe('When delete one rpg weapon', () => {
    it('should return 204 status with no content', async () => {
      const response = await model.create(weaponPayload);
      documentId = response._id as string;

      const { body } = await request(app)
        .delete(`/weapons/${documentId}`)
        .expect(HttpStatusCode.DELETED);

      expect(body).toStrictEqual({});
    });

    it('should fail with inexistent ID', async () => {
      const { body } = await request(app)
        .delete(`/weapons/${generateNewMongoID()}`)
        .expect(HttpStatusCode.NOT_FOUND);

      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('name');
      expect(body.message).toBe('NotFound a weapon with provided ID');
      expect(body.name).toBe('NotFound');
    });
  });
});
