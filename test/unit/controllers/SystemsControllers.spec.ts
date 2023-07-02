import { Request, Response } from 'express';
import SystemsModel from 'src/database/models/SystemsModel';
import SystemsServices from 'src/services/SystemsServices';
import SystemsControllers from 'src/controllers/SystemsControllers';
import { ISystem } from 'src/schemas/systemsValidationSchema';
import mocks from 'src/support/mocks';
import { IUpdateContent } from 'src/schemas/updateContentSchema';

describe('Services :: SystemsControllers', () => {
  const systemsModelMock = new SystemsModel();
  const systemsServicesMock = new SystemsServices(systemsModelMock);
  const systemsControllersMock = new SystemsControllers(systemsServicesMock);
  const systemMockInstance = mocks.system.instance as ISystem;
  const systemUpdateContentMockInsatnce = mocks.updateSystemContent.instance as IUpdateContent;
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

  describe('When a request is made to update one system by ID', () => {
    const systemMockUpdateInstance = { ...systemMockInstance, name: 'D&D' };
    const { _id: _, ...systemMockPayload } = systemMockInstance;

    beforeAll(() => {
      response.status = jest.fn().mockReturnValue(response);
      response.json = jest.fn().mockReturnValue({});

      jest.spyOn(systemsServicesMock, 'update').mockResolvedValue(systemMockUpdateInstance);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return correct data in response json with status 200', async () => {
      request.params = { _id: systemMockInstance._id as string };
      request.body = systemMockPayload;

      await systemsControllersMock.update(request, response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(systemMockUpdateInstance);
    });
  });

  describe('When a request is made to update one content system by ID', () => {
    const { method, newID } = systemUpdateContentMockInsatnce;
    const entityMockQuery = 'races';
    const updateResult = `New ID ${newID} was ${method} to array of entities ${entityMockQuery} - systemID: ${systemMockInstance._id as string}`;

    beforeAll(() => {
      response.status = jest.fn().mockReturnValue(response);
      response.send = jest.fn().mockReturnValue('');

      jest.spyOn(systemsServicesMock, 'updateContent').mockResolvedValue(updateResult);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return correct data in response json with status 201', async () => {
      request.params = { _id: systemMockInstance._id as string };
      request.body = systemUpdateContentMockInsatnce;
      request.query = { entity: entityMockQuery };

      await systemsControllersMock.updateContent(request, response);
      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.send).toHaveBeenCalledWith(updateResult);
    });
  });

  describe('When a request is made to activate one system by ID', () => {
    const updateResult = `System ${systemMockInstance._id as string} was activated`;

    beforeAll(() => {
      response.status = jest.fn().mockReturnValue(response);
      response.send = jest.fn().mockReturnValue('');

      jest.spyOn(systemsServicesMock, 'activate').mockResolvedValue(updateResult);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return correct data in response json with status 200', async () => {
      request.params = { _id: systemMockInstance._id as string };

      await systemsControllersMock.activate(request, response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.send).toHaveBeenCalledWith(updateResult);
    });
  });

  describe('When a request is made to deactivate one system by ID', () => {
    const updateResult = `System ${systemMockInstance._id as string} was deactivated`;

    beforeAll(() => {
      response.status = jest.fn().mockReturnValue(response);
      response.send = jest.fn().mockReturnValue('');

      jest.spyOn(systemsServicesMock, 'deactivate').mockResolvedValue(updateResult);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return correct data in response json with status 200', async () => {
      request.params = { _id: systemMockInstance._id as string };

      await systemsControllersMock.deactivate(request, response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.send).toHaveBeenCalledWith(updateResult);
    });
  });
});
