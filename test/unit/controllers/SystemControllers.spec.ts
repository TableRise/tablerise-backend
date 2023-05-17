import { Response, Request } from 'express';
import SystemModel from 'src/database/models/SystemModel';
import SystemServices from 'src/services/SystemServices';
import SystemControllers from 'src/controllers/SystemControllers';
import {
  SYSTEM_MOCK_INSTANCE,
  SYSTEM_MOCK_PAYLOAD
} from '../../__mocks__/system';
import HttpStatusCode from '../../../src/helpers/HttpStatusCode';

describe('Controllers :: SystemControllers', () => {
  const systemModelMock = new SystemModel();
  const systemServicesMock = new SystemServices(systemModelMock);
  const systemControllersMock = new SystemControllers(systemServicesMock);

  describe('Requests with correct data', () => {
    const request = {} as Request;
    const response = {} as Response;

    beforeAll(() => {
      response.status = jest.fn().mockReturnValue(response);
      response.json = jest.fn().mockReturnValue({});

      jest.spyOn(systemServicesMock, 'create').mockResolvedValue(SYSTEM_MOCK_INSTANCE);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('when create should return 201 and correct json response', async () => {
      request.body = SYSTEM_MOCK_PAYLOAD;
      await systemControllersMock.create(request, response);

      expect(response.status).toHaveBeenCalledWith(HttpStatusCode.CREATED);
      expect(response.json).toHaveBeenCalledWith(SYSTEM_MOCK_INSTANCE);
    });
  });
});
