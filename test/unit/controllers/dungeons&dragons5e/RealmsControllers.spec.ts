import { Request, Response } from 'express';
import RealmsModel from 'src/database/models/dungeons&dragons5e/RealmsModel';
import RealmsServices from 'src/services/dungeons&dragons5e/RealmsServices';
import RealmsControllers from 'src/controllers/dungeons&dragons5e/RealmsControllers';
import { Realm } from 'src/schemas/dungeons&dragons5e/realmsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import Connections from 'src/database/DatabaseConnection';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: RealmsControllers', () => {
    const RealmsModelMock = new RealmsModel();
    const RealmsServicesMock = new RealmsServices(RealmsModelMock, logger);
    const RealmsControllersMock = new RealmsControllers(RealmsServicesMock, logger);
    const realmMockInstance = mocks.realm.instance as Internacional<Realm>;
    const request = {} as Request;
    const response = {} as Response;

    afterAll(async () => {
        await Connections['dungeons&dragons5e'].close();
    });

    describe('When a request is made to recover all realms', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(RealmsServicesMock, 'findAll').mockResolvedValue([realmMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await RealmsControllersMock.findAll(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([realmMockInstance]);
        });
    });

    describe('When a request is made to recover all realms disabled', () => {
        realmMockInstance.active = false;
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(RealmsServicesMock, 'findAllDisabled').mockResolvedValue([realmMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await RealmsControllersMock.findAllDisabled(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([realmMockInstance]);
        });
    });

    describe('When a request is made to recover realm by ID', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(RealmsServicesMock, 'findOne').mockResolvedValue(realmMockInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: realmMockInstance._id as string };

            await RealmsControllersMock.findOne(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(realmMockInstance);
        });
    });

    describe('When a request is made to update realm by ID', () => {
        const realmMockUpdateInstance = {
            en: { ...realmMockInstance.en, name: 'Bard' },
            pt: { ...realmMockInstance.pt, name: 'Bardo' },
        };

        const { _id: _, ...realmMockPayload } = realmMockInstance;

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(RealmsServicesMock, 'update').mockResolvedValue(realmMockUpdateInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: realmMockInstance._id as string };
            request.body = realmMockPayload;

            await RealmsControllersMock.update(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(realmMockUpdateInstance);
        });
    });

    describe('When a request is made to update availability realm by ID', () => {
        const responseMessageMock = {
            message: 'Realm {id} was deactivated',
            name: 'success',
        };

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(RealmsServicesMock, 'updateAvailability').mockResolvedValue(responseMessageMock);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: realmMockInstance._id as string };
            request.query = { availability: 'false' };

            await RealmsControllersMock.updateAvailability(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(responseMessageMock);
        });
    });
});
