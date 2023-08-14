import { Request, Response } from 'express';
import MagicItemsModel from 'src/database/models/dungeons&dragons5e/MagicItemsModel';
import MagicItemsServices from 'src/services/dungeons&dragons5e/MagicItemsServices';
import MagicItemsControllers from 'src/controllers/dungeons&dragons5e/MagicItemsControllers';
import { MagicItem } from 'src/schemas/dungeons&dragons5e/magicItemsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import Connections from 'src/database/DatabaseConnection';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: MagicItemsControllers', () => {
    const MagicItemsModelMock = new MagicItemsModel();
    const MagicItemsServicesMock = new MagicItemsServices(MagicItemsModelMock, logger);
    const MagicItemsControllersMock = new MagicItemsControllers(MagicItemsServicesMock, logger);
    const magicItemMockInstance = mocks.magicItems.instance as Internacional<MagicItem>;
    const request = {} as Request;
    const response = {} as Response;

    afterAll(async () => {
        await Connections['dungeons&dragons5e'].close();
    });

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

    describe('When a request is made to recover all backgrounds disabled', () => {
        magicItemMockInstance.active = false;
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(MagicItemsServicesMock, 'findAllDisabled').mockResolvedValue([magicItemMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await MagicItemsControllersMock.findAllDisabled(request, response);
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
            pt: { ...magicItemMockInstance.pt, name: 'Olympo' },
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

    describe('When a request is made to update availability background by ID', () => {
        const responseMessageMock = {
            message: 'Magic Item {id} was deactivated',
            name: 'success',
        };

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(MagicItemsServicesMock, 'updateAvailability').mockResolvedValue(responseMessageMock);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: magicItemMockInstance._id as string };
            request.query = { availability: 'false' };

            await MagicItemsControllersMock.updateAvailability(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(responseMessageMock);
        });
    });
});
