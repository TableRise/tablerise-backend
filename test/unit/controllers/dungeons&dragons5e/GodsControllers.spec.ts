import { Request, Response } from 'express';
import GodsModel from 'src/database/models/dungeons&dragons5e/GodsModel';
import GodsServices from 'src/services/dungeons&dragons5e/GodsServices';
import GodsControllers from 'src/controllers/dungeons&dragons5e/GodsControllers';
import { God } from 'src/schemas/dungeons&dragons5e/godsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import Connections from 'src/database/DatabaseConnection';
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

    afterAll(async () => {
        await Connections['dungeons&dragons5e'].close();
    });

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

    describe('When a request is made to recover all gods disabled', () => {
        godMockInstance.active = false;
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(GodsServicesMock, 'findAllDisabled').mockResolvedValue([godMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await GodsControllersMock.findAllDisabled(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([godMockInstance]);
        });
    });

    describe('When a request is made to recover god by ID', () => {
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

    describe('When a request is made to update god by ID', () => {
        const godMockUpdateInstance = {
            en: { ...godMockInstance.en, name: 'Bard' },
            pt: { ...godMockInstance.pt, name: 'Bardo' },
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

    describe('When a request is made to update availability god by ID', () => {
        const responseMessageMock = {
            message: 'God {id} was deactivated',
            name: 'success',
        };

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(GodsServicesMock, 'updateAvailability').mockResolvedValue(responseMessageMock);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: godMockInstance._id as string };
            request.query = { availability: 'false' };

            await GodsControllersMock.updateAvailability(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(responseMessageMock);
        });
    });
});