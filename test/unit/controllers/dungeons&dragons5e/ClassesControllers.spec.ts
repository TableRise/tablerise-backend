import DatabaseManagement, { DnDClass, Internacional, SchemasDnDType } from '@tablerise/database-management';
import { Request, Response } from 'express';
import ClassesServices from 'src/services/dungeons&dragons5e/ClassesServices';
import ClassesControllers from 'src/controllers/dungeons&dragons5e/ClassesControllers';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import ValidateData from 'src/support/helpers/ValidateData';

import logger from '@tablerise/dynamic-logger';

describe('Services :: DungeonsAndDragons5e :: ClassesControllers', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new ValidateData(logger);

    const ClassesModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'Classes');
    const ClassesSchemaMock = DM_MOCK.schemaInstance('dungeons&dragons5e') as SchemasDnDType;
    const ClassesServicesMock = new ClassesServices(ClassesModelMock, logger, ValidateDataMock, ClassesSchemaMock);
    const ClassesControllersMock = new ClassesControllers(ClassesServicesMock, logger);

    const classMockInstance = mocks.class.instance as Internacional<DnDClass>;
    const request = {} as Request;
    const response = {} as Response;

    describe('When a request is made to recover all classes', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(ClassesServicesMock, 'findAll').mockResolvedValue([classMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await ClassesControllersMock.findAll(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([classMockInstance]);
        });
    });

    describe('When a request is made to recover all classes disabled', () => {
        classMockInstance.active = false;
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(ClassesServicesMock, 'findAllDisabled').mockResolvedValue([classMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await ClassesControllersMock.findAllDisabled(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([classMockInstance]);
        });
    });

    describe('When a request is made to recover class by ID', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(ClassesServicesMock, 'findOne').mockResolvedValue(classMockInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: classMockInstance._id as string };

            await ClassesControllersMock.findOne(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(classMockInstance);
        });
    });

    describe('When a request is made to update class by ID', () => {
        const classMockUpdateInstance = {
            en: { ...classMockInstance.en, name: 'Bard' },
            pt: { ...classMockInstance.pt, name: 'Bardo' },
        };

        const { _id: _, ...classMockPayload } = classMockInstance;

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(ClassesServicesMock, 'update').mockResolvedValue(classMockUpdateInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: classMockInstance._id as string };
            request.body = classMockPayload;

            await ClassesControllersMock.update(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(classMockUpdateInstance);
        });
    });

    describe('When a request is made to update availability class by ID', () => {
        const responseMessageMock = {
            message: 'Class {id} was deactivated',
            name: 'success',
        };

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(ClassesServicesMock, 'updateAvailability').mockResolvedValue(responseMessageMock);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: classMockInstance._id as string };
            request.query = { availability: 'false' };

            await ClassesControllersMock.updateAvailability(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(responseMessageMock);
        });
    });
});
