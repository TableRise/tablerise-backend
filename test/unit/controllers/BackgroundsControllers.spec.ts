import { Request, Response } from 'express';
import BackgroundsModel from 'src/database/models/BackgroundsModel';
import BackgroundsServices from 'src/services/BackgroundsServices';
import BackgroundsControllers from 'src/controllers/BackgroundsControllers';
import { Background } from 'src/schemas/backgroundsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import mocks from 'src/support/mocks';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: BackgroundsControllers', () => {
    const BackgroundsModelMock = new BackgroundsModel();
    const BackgroundsServicesMock = new BackgroundsServices(BackgroundsModelMock, logger);
    const BackgroundsControllersMock = new BackgroundsControllers(BackgroundsServicesMock, logger);
    const backgroundMockInstance = mocks.background.instance as Internacional<Background>;
    const request = {} as Request;
    const response = {} as Response;

    describe('When a request is made to recover all backgrounds', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(BackgroundsServicesMock, 'findAll').mockResolvedValue([backgroundMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await BackgroundsControllersMock.findAll(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([backgroundMockInstance]);
        });
    });

    describe('When a request is made to recover all backgrounds disabled', () => {
        backgroundMockInstance.active = false;
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(BackgroundsServicesMock, 'findAllDisabled').mockResolvedValue([backgroundMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await BackgroundsControllersMock.findAllDisabled(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([backgroundMockInstance]);
        });
    });

    describe('When a request is made to recover one background by ID', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(BackgroundsServicesMock, 'findOne').mockResolvedValue(backgroundMockInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: backgroundMockInstance._id as string };

            await BackgroundsControllersMock.findOne(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(backgroundMockInstance);
        });
    });

    describe('When a request is made to update one background by ID', () => {
        const backgroundMockUpdateInstance = {
            en: { ...backgroundMockInstance.en, name: 'Warrior' },
            pt: { ...backgroundMockInstance.pt, name: 'Warrior' },
        };

        const { _id: _, ...backgroundMockPayload } = backgroundMockInstance;

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(BackgroundsServicesMock, 'update').mockResolvedValue(backgroundMockUpdateInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: backgroundMockInstance._id as string };
            request.body = backgroundMockPayload;

            await BackgroundsControllersMock.update(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(backgroundMockUpdateInstance);
        });
    });

    describe('When a request is made to update availability background by ID', () => {
        const responseMessageMock = {
            message: 'Background {id} was deactivated',
            name: 'success',
        };

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(BackgroundsServicesMock, 'updateAvailability').mockResolvedValue(responseMessageMock);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: backgroundMockInstance._id as string };
            request.query = { availability: 'false' };

            await BackgroundsControllersMock.updateAvailability(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(responseMessageMock);
        });
    });
});
