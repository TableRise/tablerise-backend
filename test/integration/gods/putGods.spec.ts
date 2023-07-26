import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import GodsModel from 'src/database/models/GodsModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { God } from 'src/schemas/godsValidationSchema';
import mocks from 'src/support/mocks';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Put RPG gods in database', () => {
  beforeAll(() => {
    connect();
  });

  afterAll(async () => {
    await close();
  });

  const model = new GodsModel();
  const god = mocks.god.instance as Internacional<God>;
  const { _id: _, ...godPayload } = god;

  const newGodPayload = {
    en: { ...godPayload.en, name: 'Olympo' },
    pt: { ...godPayload.pt, name: 'Olympo' }
  }

  let documentId: string;

  describe('When update one rpg god', () => {
    it('should return updated god', async () => {
      const keysToTest = ['name', 'alignment', 'suggestedDomains', 'symbol', 'phanteon'];

      const response = await model.create(godPayload);
      documentId = response._id as string;

      const { body } = await request(app)
        .put(`/gods/${documentId}`)
        .send(newGodPayload)
        .expect(HttpStatusCode.OK);

      expect(body).toHaveProperty('_id');

      keysToTest.forEach((key) => {
        expect(body.en).toHaveProperty(key);
        expect(body.pt).toHaveProperty(key);
      });

      expect(body.en.name).toBe('Olympo');
      expect(body.pt.name).toBe('Olympo');
    });

    it('should fail when data is wrong', async () => {
      const { body } = await request(app)
        .put(`/gods/${documentId}`)
        .send({ data: null } as unknown as Internacional<God>)
        .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('name');
      expect(JSON.parse(body.message)[0].path[0]).toBe('en');
      expect(JSON.parse(body.message)[0].message).toBe('Required');
      expect(body.name).toBe('ValidationError');
    });

    it('should fail with inexistent ID', async () => {
      const { body } = await request(app)
        .put(`/gods/${generateNewMongoID()}`)
        .send(newGodPayload)
        .expect(HttpStatusCode.NOT_FOUND);

      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('name');
      expect(body.message).toBe('NotFound a god with provided ID');
      expect(body.name).toBe('NotFound');
    });
  });
});
