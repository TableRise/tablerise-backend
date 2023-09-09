import DatabaseManagement, { DnDRealm, Internacional } from '@tablerise/database-management';
import { Request, Response } from 'express';
import RealmsServices from 'src/services/dungeons&dragons5e/RealmsServices';
import RealmsControllers from 'src/controllers/dungeons&dragons5e/RealmsControllers';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import ValidateData from 'src/support/helpers/ValidateData';

import logger from '@tablerise/dynamic-logger';

describe('Services :: DungeonsAndDragons5e :: RealmsControllers', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new ValidateData(logger);

    const RealmsModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'Realms');
    const RealmsSchemaMock = DM_MOCK.schemaInstance('dungeons&dragons5e');
    const RealmsServicesMock = new RealmsServices(RealmsModelMock, logger, ValidateDataMock, RealmsSchemaMock);
    const RealmsControllersMock = new RealmsControllers(RealmsServicesMock, logger);

    const realmMockInstance = mocks.realm.instance as Internacional<DnDRealm>;
    const request = {} as Request;
    const response = {} as Response;

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
