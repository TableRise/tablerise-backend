import { Request, Response } from 'express';
import BackgroundsModel from 'src/database/models/BackgroundsModel';
import BackgroundsServices from 'src/services/BackgroundsServices';
import BackgroundsControllers from 'src/controllers/BackgroundsControllers';
import { Background } from 'src/schemas/backgroundsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import mocks from 'src/support/mocks';

describe('Services :: BackgroundsControllers', () => {
    const BackgroundsModelMock = new BackgroundsModel();
    const BackgroundsServicesMock = new BackgroundsServices(BackgroundsModelMock);
    const BackgroundsControllersMock = new BackgroundsControllers(BackgroundsServicesMock);
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

    describe('When a request is made to delete a background', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.end = jest.fn().mockReturnValue({});

            jest.spyOn(BackgroundsServicesMock, 'delete').mockResolvedValue();
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should not return any data in response with status 204', async () => {
            request.params = { _id: backgroundMockInstance._id as string };

            await BackgroundsControllersMock.delete(request, response);
            expect(response.status).toHaveBeenCalledWith(204);
            expect(response.end).toHaveBeenCalled();
        });
    });
});
