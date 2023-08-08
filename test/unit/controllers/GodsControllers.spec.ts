import { Request, Response } from 'express';
import GodsModel from 'src/database/models/GodsModel';
import GodsServices from 'src/services/GodsServices';
import GodsControllers from 'src/controllers/GodsControllers';
import { God } from 'src/schemas/godsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import mocks from 'src/support/mocks';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: GodsControllers', () => {
    const GodsModelMock = new GodsModel();
    const ValidateDataMock = new ValidateData(logger);
    const GodsServicesMock = new GodsServices(GodsModelMock, logger, ValidateDataMock);
    const GodsControllersMock = new GodsControllers(GodsServicesMock, logger);
    const godMockInstance = mocks.god.instance as Internacional<God>;
    const request = {} as Request;
    const response = {} as Response;

    describe('When a request is made to recover all gods', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(GodsServicesMock, 'findAll').mockResolvedValue([godMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await GodsControllersMock.findAll(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([godMockInstance]);
        });
    });

    describe('When a request is made to recover one god by ID', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(GodsServicesMock, 'findOne').mockResolvedValue(godMockInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: godMockInstance._id as string };

            await GodsControllersMock.findOne(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(godMockInstance);
        });
    });

    describe('When a request is made to update one god by ID', () => {
        const godMockUpdateInstance = {
            en: { ...godMockInstance.en, name: 'Olympo' },
            pt: { ...godMockInstance.pt, name: 'Olympo' },
        };

        const { _id: _, ...godMockPayload } = godMockInstance;

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(GodsServicesMock, 'update').mockResolvedValue(godMockUpdateInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: godMockInstance._id as string };
            request.body = godMockPayload;

            await GodsControllersMock.update(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(godMockUpdateInstance);
        });
    });

    describe('When a request is made to delete a god', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.end = jest.fn().mockReturnValue({});

            jest.spyOn(GodsServicesMock, 'delete').mockResolvedValue();
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should not return any data in response with status 204', async () => {
            request.params = { _id: godMockInstance._id as string };

            await GodsControllersMock.delete(request, response);
            expect(response.status).toHaveBeenCalledWith(204);
            expect(response.end).toHaveBeenCalled();
        });
    });
});
