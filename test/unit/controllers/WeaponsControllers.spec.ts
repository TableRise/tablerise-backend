import { Request, Response } from 'express';
import WeaponsModel from 'src/database/models/WeaponsModel';
import WeaponsServices from 'src/services/WeaponsServices';
import WeaponsControllers from 'src/controllers/WeaponsControllers';
import { Weapon } from 'src/schemas/weaponsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import mocks from 'src/support/mocks';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: WeaponsControllers', () => {
    const WeaponsModelMock = new WeaponsModel();
    const WeaponsServicesMock = new WeaponsServices(WeaponsModelMock, logger);
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

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await WeaponsControllersMock.findAll(request, response);
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

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: weaponMockInstance._id as string };

            await WeaponsControllersMock.findOne(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(weaponMockInstance);
        });
    });

    describe('When a request is made to update weapon weapon by ID', () => {
        const weaponMockUpdateInstance = {
            en: { ...weaponMockInstance.en, name: 'Olympo' },
            pt: { ...weaponMockInstance.pt, name: 'Olympo' },
        };

        const { _id: _, ...weaponMockPayload } = weaponMockInstance;

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(WeaponsServicesMock, 'update').mockResolvedValue(weaponMockUpdateInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: weaponMockInstance._id as string };
            request.body = weaponMockPayload;

            await WeaponsControllersMock.update(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(weaponMockUpdateInstance);
        });
    });

    describe('When a request is made to delete a weapon', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.end = jest.fn().mockReturnValue({});

            jest.spyOn(WeaponsServicesMock, 'delete').mockResolvedValue();
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should not return any data in response with status 204', async () => {
            request.params = { _id: weaponMockInstance._id as string };

            await WeaponsControllersMock.delete(request, response);
            expect(response.status).toHaveBeenCalledWith(204);
            expect(response.end).toHaveBeenCalled();
        });
    });
});
