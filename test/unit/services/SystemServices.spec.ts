import SystemModel from '../../../src/database/models/SystemModel';
import SystemServices from '../../../src/services/SystemServices';
import { ISystem } from '../../../src/interfaces/ISystem';
import {
  SYSTEM_MOCK_INSTANCE,
  SYSTEM_MOCK_PAYLOAD,
  ZOD_ERROR_SYSTEM_NAME
} from '../../__mocks__/system';
import HttpStatusCode from '../../../src/helpers/HttpStatusCode';

describe('Test System Services', () => {
  const systemModelMock = new SystemModel();
  const systemServicesMock = new SystemServices(systemModelMock);

  describe('when data is correct', () => {
    const systemInstanceKeys = Object.keys(SYSTEM_MOCK_INSTANCE);

    beforeAll(() => {
      jest.spyOn(systemModelMock, 'create').mockResolvedValue(SYSTEM_MOCK_INSTANCE);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('a new rpg system should be created', async () => {
      const responseTest = await systemServicesMock.create(SYSTEM_MOCK_PAYLOAD);

      systemInstanceKeys.forEach((key) => {
        expect(responseTest).toHaveProperty(key);
      });

      expect(responseTest.rule_ids).toHaveProperty('race');
      expect(responseTest.rule_ids).toHaveProperty('class');
      expect(responseTest.rule_ids).toHaveProperty('items');
      expect(responseTest.rule_ids).toHaveProperty('attacks');
      expect(responseTest.rule_ids).toHaveProperty('background');
    })
  });

  describe('when data is incorrect', () => {
    beforeAll(() => {
      jest.spyOn(systemModelMock, 'create').mockResolvedValue(SYSTEM_MOCK_INSTANCE);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('a new rpg system should fail and throws 422 error', async () => {
      const { name: _, ...systemMockPayloadNoName } = SYSTEM_MOCK_PAYLOAD;

      try {
        await systemServicesMock.create(systemMockPayloadNoName as ISystem);
      } catch (error: any) {
        expect(Number(error.stack)).toBe(HttpStatusCode.UNPROCESSABLE_ENTITY);
        expect(JSON.parse(error.message)).toEqual(ZOD_ERROR_SYSTEM_NAME.message);
      }
    })
  });
});
