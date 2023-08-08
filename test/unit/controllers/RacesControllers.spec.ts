import { Request, Response } from 'express';
import RacesModel from 'src/database/models/RacesModel';
import RacesServices from 'src/services/RacesServices';
import RacesControllers from 'src/controllers/RacesControllers';
import { Race } from 'src/schemas/racesValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import mocks from 'src/support/mocks';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: RacesControllers', () => {
    const RacesModelMock = new RacesModel();
    const ValidateDataMock = new ValidateData(logger);
    const RacesServicesMock = new RacesServices(RacesModelMock, logger, ValidateDataMock);
    const RacesControllersMock = new RacesControllers(RacesServicesMock, logger);
    const RaceMockInstance = mocks.race.instance as Internacional<Race>;
    const request = {} as Request;
    const response = {} as Response;

    describe('When a request is made to recover all Races', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(RacesServicesMock, 'findAll').mockResolvedValue([RaceMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await RacesControllersMock.findAll(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([RaceMockInstance]);
        });
    });

    describe('When a request is made to recover one Race by ID', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(RacesServicesMock, 'findOne').mockResolvedValue(RaceMockInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: RaceMockInstance._id as string };

            await RacesControllersMock.findOne(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(RaceMockInstance);
        });
    });

    describe('When a request is made to update one Race by ID', () => {
        const RaceMockUpdateInstance = {
            en: { ...RaceMockInstance.en, name: 'Human' },
            pt: { ...RaceMockInstance.pt, name: 'Humano' },
        };

        const { _id: _, ...RaceMockPayload } = RaceMockInstance;

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(RacesServicesMock, 'update').mockResolvedValue(RaceMockUpdateInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: RaceMockInstance._id as string };
            request.body = RaceMockPayload;

            await RacesControllersMock.update(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(RaceMockUpdateInstance);
        });
    });

    describe('When a request is made to delete a Race', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.end = jest.fn().mockReturnValue({});

            jest.spyOn(RacesServicesMock, 'delete').mockResolvedValue();
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should not return any data in response with status 204', async () => {
            request.params = { _id: RaceMockInstance._id as string };

            await RacesControllersMock.delete(request, response);
            expect(response.status).toHaveBeenCalledWith(204);
            expect(response.end).toHaveBeenCalled();
        });
    });
});
