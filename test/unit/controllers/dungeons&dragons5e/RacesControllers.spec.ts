import { Request, Response } from 'express';
import RacesModel from 'src/database/models/dungeons&dragons5e/RacesModel';
import RacesServices from 'src/services/dungeons&dragons5e/RacesServices';
import RacesControllers from 'src/controllers/dungeons&dragons5e/RacesControllers';
import { Race } from 'src/schemas/dungeons&dragons5e/racesValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import Connections from 'src/database/DatabaseConnection';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: RacesControllers', () => {
    const RacesModelMock = new RacesModel();
    const RacesServicesMock = new RacesServices(RacesModelMock, logger);
    const RacesControllersMock = new RacesControllers(RacesServicesMock, logger);
    const RaceMockInstance = mocks.race.instance as Internacional<Race>;
    const request = {} as Request;
    const response = {} as Response;

    afterAll(async () => {
        await Connections['dungeons&dragons5e'].close();
    });

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

    describe('When a request is made to recover all disabled races', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(RacesServicesMock, 'findAllDisabled').mockResolvedValue([RaceMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await RacesControllersMock.findAllDisabled(request, response);
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

    describe('When a request is made to update availability race by ID', () => {
        const responseMessageMock = {
            message: 'Race {id} was deactivated',
            name: 'success',
        };

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(RacesServicesMock, 'updateAvailability').mockResolvedValue(responseMessageMock);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: RaceMockInstance._id as string };
            request.query = { availability: 'false' };

            await RacesControllersMock.updateAvailability(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(responseMessageMock);
        });
    });
});
