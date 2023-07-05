import { Request, Response } from 'express';
import RealmsModel from 'src/database/models/RealmsModel';
import RealmsServices from 'src/services/RealmsServices';
import RealmsControllers from 'src/controllers/RealmsControllers';
import { Realm } from 'src/schemas/realmsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import mocks from 'src/support/mocks';

describe('Services :: RealmsControllers', () => {
  const RealmsModelMock = new RealmsModel();
  const RealmsServicesMock = new RealmsServices(RealmsModelMock);
  const RealmsControllersMock = new RealmsControllers(RealmsServicesMock);
  const realmsMockInstance = mocks.realm.instance as Internacional<Realm>;
  const request = {} as Request;
  const response = {} as Response;

  describe('When a request is made to recover all realms', () => {
    beforeAll(() => {
      response.status = jest.fn().mockReturnValue(response);
      response.json = jest.fn().mockReturnValue({});

      jest.spyOn(RealmsServicesMock, 'findAll').mockResolvedValue([realmsMockInstance]);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return correct data in response json with status 200', async () => {
      await RealmsControllersMock.findAll(request, response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith([realmsMockInstance]);
    });
  });

  describe('When a request is made to recover one realm by ID', () => {
    beforeAll(() => {
      response.status = jest.fn().mockReturnValue(response);
      response.json = jest.fn().mockReturnValue({});

      jest.spyOn(RealmsServicesMock, 'findOne').mockResolvedValue(realmsMockInstance);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return correct data in response json with status 200', async () => {
      request.params = { _id: realmsMockInstance._id as string };

      await RealmsControllersMock.findOne(request, response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(realmsMockInstance);
    });
  });

  describe('When a request is made to update one realm by ID', () => {
    const realmMockUpdateInstance = { ...realmsMockInstance, name: 'Olympo' };
    const { _id: _, ...realmMockPayload } = realmsMockInstance;

    beforeAll(() => {
      response.status = jest.fn().mockReturnValue(response);
      response.json = jest.fn().mockReturnValue({});

      jest.spyOn(RealmsServicesMock, 'update').mockResolvedValue(realmMockUpdateInstance);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return correct data in response json with status 200', async () => {
      request.params = { _id: realmsMockInstance._id as string };
      request.body = realmMockPayload;

      await RealmsControllersMock.update(request, response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(realmMockUpdateInstance);
    });
  });

  describe('When a request is made to delete a realm', () => {
    beforeAll(() => {
      response.status = jest.fn().mockReturnValue(response);
      response.end = jest.fn().mockReturnValue({});

      jest.spyOn(RealmsServicesMock, 'delete').mockResolvedValue();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should not return any data in response with status 204', async () => {
      request.params = { _id: realmsMockInstance._id as string };

      await RealmsControllersMock.delete(request, response);
      expect(response.status).toHaveBeenCalledWith(204);
      expect(response.end).toHaveBeenCalled();
    });
  });
});
