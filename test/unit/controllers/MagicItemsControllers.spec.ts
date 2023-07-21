import { Request, Response } from 'express';
import MagicItemsModel from 'src/database/models/MagicItemsModel';
import MagicItemsServices from 'src/services/MagicItemsServices';
import MagicItemsControllers from 'src/controllers/MagicItemsControllers';
import { MagicItem } from 'src/schemas/magicItemsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import mocks from 'src/support/mocks';

describe('Services :: MagicItemsControllers', () => {
  const MagicItemsModelMock = new MagicItemsModel();
  const MagicItemsServicesMock = new MagicItemsServices(MagicItemsModelMock);
  const MagicItemsControllersMock = new MagicItemsControllers(MagicItemsServicesMock);
  const magicItemMockInstance = mocks.magicItems.instance as Internacional<MagicItem>;
  const request = {} as Request;
  const response = {} as Response;

  describe('When a request is made to recover all magic items', () => {
    beforeAll(() => {
      response.status = jest.fn().mockReturnValue(response);
      response.json = jest.fn().mockReturnValue({});

      jest.spyOn(MagicItemsServicesMock, 'findAll').mockResolvedValue([magicItemMockInstance]);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return correct data in response json with status 200', async () => {
      await MagicItemsControllersMock.findAll(request, response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith([magicItemMockInstance]);
    });
  });

  describe('When a request is made to recover magic item god by ID', () => {
    beforeAll(() => {
      response.status = jest.fn().mockReturnValue(response);
      response.json = jest.fn().mockReturnValue({});

      jest.spyOn(MagicItemsServicesMock, 'findOne').mockResolvedValue(magicItemMockInstance);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return correct data in response json with status 200', async () => {
      request.params = { _id: magicItemMockInstance._id as string };

      await MagicItemsControllersMock.findOne(request, response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(magicItemMockInstance);
    });
  });

  describe('When a request is made to update magic item god by ID', () => {
    const magicItemMockUpdateInstance = {
      en: { ...magicItemMockInstance.en, name: 'Olympo' },
      pt: { ...magicItemMockInstance.pt, name: 'Olympo' }
    };

    const { _id: _, ...magicItemMockPayload } = magicItemMockInstance;

    beforeAll(() => {
      response.status = jest.fn().mockReturnValue(response);
      response.json = jest.fn().mockReturnValue({});

      jest.spyOn(MagicItemsServicesMock, 'update').mockResolvedValue(magicItemMockUpdateInstance);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should return correct data in response json with status 200', async () => {
      request.params = { _id: magicItemMockInstance._id as string };
      request.body = magicItemMockPayload;

      await MagicItemsControllersMock.update(request, response);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(magicItemMockUpdateInstance);
    });
  });

  describe('When a request is made to delete a god', () => {
    beforeAll(() => {
      response.status = jest.fn().mockReturnValue(response);
      response.end = jest.fn().mockReturnValue({});

      jest.spyOn(MagicItemsServicesMock, 'delete').mockResolvedValue();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should not return any data in response with status 204', async () => {
      request.params = { _id: magicItemMockInstance._id as string };

      await MagicItemsControllersMock.delete(request, response);
      expect(response.status).toHaveBeenCalledWith(204);
      expect(response.end).toHaveBeenCalled();
    });
  });
});
