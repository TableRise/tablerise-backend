import { Request, Response } from 'express';
import ItemsModel from 'src/database/models/dungeons&dragons5e/ItemsModel';
import ItemsServices from 'src/services/dungeons&dragons5e/ItemsServices';
import ItemsControllers from 'src/controllers/dungeons&dragons5e/ItemsControllers';
import { Item } from 'src/schemas/dungeons&dragons5e/itemsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import Connections from 'src/database/DatabaseConnection';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: ItemsControllers', () => {
    const ItemsModelMock = new ItemsModel();
    const ItemsServicesMock = new ItemsServices(ItemsModelMock, logger);
    const ItemsControllersMock = new ItemsControllers(ItemsServicesMock, logger);
    const ItemMockInstance = mocks.item.instance as Internacional<Item>;
    const request = {} as Request;
    const response = {} as Response;

    afterAll(async () => {
        await Connections['dungeons&dragons5e'].close();
    });

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
