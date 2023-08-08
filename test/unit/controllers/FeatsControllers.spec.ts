import { Request, Response } from 'express';
import FeatsModel from 'src/database/models/FeatsModel';
import FeatsServices from 'src/services/FeatsServices';
import FeatsControllers from 'src/controllers/FeatsControllers';
import { Feat } from 'src/schemas/featsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import mocks from 'src/support/mocks';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: FeatsControllers', () => {
    const FeatsModelMock = new FeatsModel();
    const ValidateDataMock = new ValidateData(logger);
    const FeatsServicesMock = new FeatsServices(FeatsModelMock, logger, ValidateDataMock);
    const FeatsControllersMock = new FeatsControllers(FeatsServicesMock, logger);
    const featMockInstance = mocks.feat.instance as Internacional<Feat>;
    const request = {} as Request;
    const response = {} as Response;

    describe('When a request is made to recover all feats', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(FeatsServicesMock, 'findAll').mockResolvedValue([featMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await FeatsControllersMock.findAll(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([featMockInstance]);
        });
    });

    describe('When a request is made to recover feat god by ID', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(FeatsServicesMock, 'findOne').mockResolvedValue(featMockInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: featMockInstance._id as string };

            await FeatsControllersMock.findOne(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(featMockInstance);
        });
    });

    describe('When a request is made to update feat god by ID', () => {
        const featMockUpdateInstance = {
            en: { ...featMockInstance.en, name: 'Olympo' },
            pt: { ...featMockInstance.pt, name: 'Olympo' },
        };

        const { _id: _, ...featMockPayload } = featMockInstance;

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(FeatsServicesMock, 'update').mockResolvedValue(featMockUpdateInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: featMockInstance._id as string };
            request.body = featMockPayload;

            await FeatsControllersMock.update(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(featMockUpdateInstance);
        });
    });

    describe('When a request is made to delete a god', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.end = jest.fn().mockReturnValue({});

            jest.spyOn(FeatsServicesMock, 'delete').mockResolvedValue();
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should not return any data in response with status 204', async () => {
            request.params = { _id: featMockInstance._id as string };

            await FeatsControllersMock.delete(request, response);
            expect(response.status).toHaveBeenCalledWith(204);
            expect(response.end).toHaveBeenCalled();
        });
    });
});
