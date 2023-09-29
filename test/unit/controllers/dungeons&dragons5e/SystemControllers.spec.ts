import DatabaseManagement from '@tablerise/database-management';
import { Request, Response } from 'express';
import SystemsServices from 'src/services/dungeons&dragons5e/SystemServices';
import SystemsControllers from 'src/controllers/dungeons&dragons5e/SystemControllers';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import ValidateData from 'src/services/helpers/ValidateData';

import logger from '@tablerise/dynamic-logger';
import { System } from 'src/schemas/dungeons&dragons5e/systemValidationSchema';
import { UpdateContent } from 'src/schemas/updateContentSchema';
import schema from 'src/schemas';

describe('Services :: DungeonsAndDragons5e :: SystemsControllers', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new ValidateData();

    const SystemsModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'System');
    const SystemsServicesMock = new SystemsServices(
        SystemsModelMock,
        logger,
        ValidateDataMock,
        schema['dungeons&dragons5e']
    );
    const SystemsControllersMock = new SystemsControllers(SystemsServicesMock, logger);

    const systemMockInstance = mocks.system.instance as System & { _id: string };
    const systemUpdateContentMockInsatnce = mocks.updateSystemContent.instance as UpdateContent;
    const request = {} as Request;
    const response = {} as Response;

    describe('When a request is made to recover all systems', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(SystemsServicesMock, 'findAll').mockResolvedValue([systemMockInstance]);
        });

        afterAll(() => jest.clearAllMocks());

        it('should return correct data in response json with status 200', async () => {
            await SystemsControllersMock.findAll(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([systemMockInstance]);
        });
    });

    describe('When a request is made to recover one system by ID', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(SystemsServicesMock, 'findOne').mockResolvedValue(systemMockInstance);
        });

        afterAll(() => jest.clearAllMocks());

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: systemMockInstance._id };

            await SystemsControllersMock.findOne(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(systemMockInstance);
        });
    });

    describe('When a request is made to update one system by ID', () => {
        const systemMockUpdateInstance = { ...systemMockInstance, name: 'D&D' };
        const { _id: _, ...systemMockPayload } = systemMockInstance;

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(SystemsServicesMock, 'update').mockResolvedValue(systemMockUpdateInstance);
        });

        afterAll(() => jest.clearAllMocks());

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: systemMockInstance._id };
            request.body = systemMockPayload;

            await SystemsControllersMock.update(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(systemMockUpdateInstance);
        });
    });

    describe('When a request is made to update one content system by ID', () => {
        const { method, newID } = systemUpdateContentMockInsatnce;
        const entityMockQuery = 'races';
        const updateResult = `New ID ${newID} was ${
            method as string
        } to array of entities ${entityMockQuery} - systemID: ${systemMockInstance._id}`;

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.send = jest.fn().mockReturnValue('');

            jest.spyOn(SystemsServicesMock, 'updateContent').mockResolvedValue(updateResult);
        });

        afterAll(() => jest.clearAllMocks());

        it('should return correct data in response json with status 201', async () => {
            request.params = { _id: systemMockInstance._id };
            request.body = systemUpdateContentMockInsatnce;
            request.query = { entity: entityMockQuery };

            await SystemsControllersMock.updateContent(request, response);
            expect(response.status).toHaveBeenCalledWith(201);
            expect(response.send).toHaveBeenCalledWith(updateResult);
        });
    });

    describe('When a request is made to update availability system by ID', () => {
        const responseMessageMock = {
            message: 'System {id} was deactivated',
            name: 'success',
        };

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(SystemsServicesMock, 'updateAvailability').mockResolvedValue(responseMessageMock);
        });

        afterAll(() => jest.clearAllMocks());

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: systemMockInstance._id };
            request.query = { availability: 'false' };

            await SystemsControllersMock.updateAvailability(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(responseMessageMock);
        });
    });
});
