import { Request, Response } from 'express';
import ItemsModel from 'src/database/models/ItemsModel';
import ItemsServices from 'src/services/ItemsServices';
import ItemsControllers from 'src/controllers/ItemsControllers';
import { Item } from 'src/schemas/itemsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import mocks from 'src/support/mocks';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: ItemsControllers', () => {
    const ItemsModelMock = new ItemsModel();
    const ValidateDataMock = new ValidateData(logger);
    const ItemsServicesMock = new ItemsServices(ItemsModelMock, logger, ValidateDataMock);
    const ItemsControllersMock = new ItemsControllers(ItemsServicesMock, logger);
    const ItemMockInstance = mocks.item.instance as Internacional<Item>;
    const request = {} as Request;
    const response = {} as Response;

    describe('When a request is made to recover all Items', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(ItemsServicesMock, 'findAll').mockResolvedValue([ItemMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await ItemsControllersMock.findAll(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([ItemMockInstance]);
        });
    });

    describe('When a request is made to recover all disabled items', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(ItemsServicesMock, 'findAllDisabled').mockResolvedValue([ItemMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await ItemsControllersMock.findAllDisabled(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([ItemMockInstance]);
        });
    });

    describe('When a request is made to recover one Item by ID', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(ItemsServicesMock, 'findOne').mockResolvedValue(ItemMockInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: ItemMockInstance._id as string };

            await ItemsControllersMock.findOne(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(ItemMockInstance);
        });
    });

    describe('When a request is made to update one Item by ID', () => {
        const ItemMockUpdateInstance = {
            en: { ...ItemMockInstance.en, name: 'History of Jytelion' },
            pt: { ...ItemMockInstance.pt, name: 'História de Jytelion' },
        };

        const { _id: _, ...ItemMockPayload } = ItemMockInstance;

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(ItemsServicesMock, 'update').mockResolvedValue(ItemMockUpdateInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: ItemMockInstance._id as string };
            request.body = ItemMockPayload;

            await ItemsControllersMock.update(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(ItemMockUpdateInstance);
        });
    });

    describe('When a request is made to update availability item by ID', () => {
        const responseMessageMock = {
            message: 'Item {id} was deactivated',
            name: 'success',
        };

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(ItemsServicesMock, 'updateAvailability').mockResolvedValue(responseMessageMock);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: ItemMockInstance._id as string };
            request.query = { availability: 'false' };

            await ItemsControllersMock.updateAvailability(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(responseMessageMock);
        });
    });
});
