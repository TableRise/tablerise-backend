import DatabaseManagement from '@tablerise/database-management';
import { Request, Response } from 'express';
import BackgroundsServices from 'src/services/dungeons&dragons5e/BackgroundsServices';
import BackgroundsControllers from 'src/controllers/dungeons&dragons5e/BackgroundsControllers';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import ValidateData from 'src/support/helpers/ValidateData';

import logger from '@tablerise/dynamic-logger';
import { Background } from 'src/schemas/dungeons&dragons5e/backgroundsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import schema from 'src/schemas';

describe('Services :: DungeonsAndDragons5e :: BackgroundsControllers', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new ValidateData();

    const BackgroundsModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'Backgrounds');
    const BackgroundsServicesMock = new BackgroundsServices(
        BackgroundsModelMock,
        logger,
        ValidateDataMock,
        schema['dungeons&dragons5e']
    );
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
