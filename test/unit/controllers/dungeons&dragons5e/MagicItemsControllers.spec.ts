import DatabaseManagement, { DnDMagicItem, Internacional } from '@tablerise/database-management';
import { Request, Response } from 'express';
import MagicItemsServices from 'src/services/dungeons&dragons5e/MagicItemsServices';
import MagicItemsControllers from 'src/controllers/dungeons&dragons5e/MagicItemsControllers';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: MagicItemsControllers', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new ValidateData(logger);

    const MagicItemsModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'MagicItems', { mock: true });
    const MagicItemsSchemaMock = DM_MOCK.schemaInstance('dungeons&dragons5e');
    const MagicItemsServicesMock = new MagicItemsServices(
        MagicItemsModelMock,
        logger,
        ValidateDataMock,
        MagicItemsSchemaMock
    );
    const MagicItemsControllersMock = new MagicItemsControllers(MagicItemsServicesMock, logger);

    const magicItemMockInstance = mocks.magicItems.instance as Internacional<DnDMagicItem>;
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
