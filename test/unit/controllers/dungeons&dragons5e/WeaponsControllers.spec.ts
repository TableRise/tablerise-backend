import DatabaseManagement from '@tablerise/database-management';
import { Request, Response } from 'express';
import WeaponsServices from 'src/services/dungeons&dragons5e/WeaponsServices';
import WeaponsControllers from 'src/controllers/dungeons&dragons5e/WeaponsControllers';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import SchemaValidator from 'src/services/helpers/SchemaValidator';

import logger from '@tablerise/dynamic-logger';
import { Weapon } from 'src/schemas/dungeons&dragons5e/weaponsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import schema from 'src/schemas';

describe('Services :: DungeonsAndDragons5e :: WeaponsControllers', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new SchemaValidator();

    const WeaponsModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'System');
    const WeaponsServicesMock = new WeaponsServices(
        WeaponsModelMock,
        logger,
        ValidateDataMock,
        schema['dungeons&dragons5e']
    );
    const WeaponsControllersMock = new WeaponsControllers(WeaponsServicesMock, logger);

    const weaponMockInstance = mocks.weapon.instance as Internacional<Weapon>;
    const request = {} as Request;
    const response = {} as Response;

    describe('When a request is made to recover all weapons', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(WeaponsServicesMock, 'findAll').mockResolvedValue([weaponMockInstance]);
        });

        afterAll(() => jest.clearAllMocks());

        it('should return correct data in response json with status 200', async () => {
            await WeaponsControllersMock.findAll(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([weaponMockInstance]);
        });
    });

    describe('When a request is made to recover all disabled weapons', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(WeaponsServicesMock, 'findAllDisabled').mockResolvedValue([weaponMockInstance]);
        });

        afterAll(() => jest.clearAllMocks());

        it('should return correct data in response json with status 200', async () => {
            await WeaponsControllersMock.findAllDisabled(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([weaponMockInstance]);
        });
    });

    describe('When a request is made to recover weapon by ID', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(WeaponsServicesMock, 'findOne').mockResolvedValue(weaponMockInstance);
        });

        afterAll(() => jest.clearAllMocks());

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: weaponMockInstance._id as string };

            await WeaponsControllersMock.findOne(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(weaponMockInstance);
        });
    });

    describe('When a request is made to update weapon by ID', () => {
        const weaponMockUpdateInstance = {
            en: { ...weaponMockInstance.en, name: 'Cluster' },
            pt: { ...weaponMockInstance.pt, name: 'Clave' },
        };

        const { _id: _, ...weaponMockPayload } = weaponMockInstance;

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(WeaponsServicesMock, 'update').mockResolvedValue(weaponMockUpdateInstance);
        });

        afterAll(() => jest.clearAllMocks());

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: weaponMockInstance._id as string };
            request.body = weaponMockPayload;

            await WeaponsControllersMock.update(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(weaponMockUpdateInstance);
        });
    });

    describe('When a request is made to update availability weapon by ID', () => {
        const responseMessageMock = {
            message: 'Weapon {id} was deactivated',
            name: 'success',
        };

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(WeaponsServicesMock, 'updateAvailability').mockResolvedValue(responseMessageMock);
        });

        afterAll(() => jest.clearAllMocks());

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: weaponMockInstance._id as string };
            request.query = { availability: 'false' };

            await WeaponsControllersMock.updateAvailability(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(responseMessageMock);
        });
    });
});
