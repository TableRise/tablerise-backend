import { Request, Response } from 'express';
import SystemsModel from 'src/database/models/SystemsModel';
import SystemsServices from 'src/services/SystemsServices';
import SystemsControllers from 'src/controllers/SystemsControllers';
import { ISystem } from 'src/schemas/systemsValidationSchema';
import mocks from 'src/support/schemas';

describe('Services :: SystemsControllers', () => {
  const systemsModelMock = new SystemsModel();
  const systemsServicesMock = new SystemsServices(systemsModelMock);
  const systemsControllersMock = new SystemsControllers(systemsServicesMock);
  const systemMockInstance = mocks.system.instance as ISystem;
  const request = {} as Request;
  const response = {} as Response;

  describe('When a request is made to recover all systems', () => {
    beforeAll(() => {
      response.status = jest.fn().mockReturnValue(response);
      response.json = jest.fn().mockReturnValue({});

      jest.spyOn(systemsServicesMock, 'findAll').mockResolvedValue([systemMockInstance]);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return correct data in response json with status 200', async () => {
      await systemsControllersMock.findAll(request, response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith([systemMockInstance]);
    });
  });

  describe('When a request is made to recover one system by ID', () => {
    beforeAll(() => {
      response.status = jest.fn().mockReturnValue(response);
      response.json = jest.fn().mockReturnValue({});

      jest.spyOn(systemsServicesMock, 'findOne').mockResolvedValue(systemMockInstance);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return correct data in response json with status 200', async () => {
      request.params = { _id: systemMockInstance._id as string };

      await systemsControllersMock.findOne(request, response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(systemMockInstance);
    });
  });
});
