import { Request, Response } from 'express';
import MonstersModel from 'src/database/models/dungeons&dragons5e/MonstersModel';
import MonstersServices from 'src/services/dungeons&dragons5e/MonstersServices';
import MonstersControllers from 'src/controllers/dungeons&dragons5e/MonstersControllers';
import { Monster } from 'src/schemas/dungeons&dragons5e/monstersValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import mocks from 'src/support/mocks/dungeons&dragons5e';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: MonstersControllers', () => {
    const MonstersModelMock = new MonstersModel();
    const MonstersServicesMock = new MonstersServices(MonstersModelMock, logger);
    const MonstersControllersMock = new MonstersControllers(MonstersServicesMock, logger);
    const monsterMockInstance = mocks.monster.instance as Internacional<Monster>;
    const request = {} as Request;
    const response = {} as Response;

    describe('When a request is made to recover all monsters', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(MonstersServicesMock, 'findAll').mockResolvedValue([monsterMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await MonstersControllersMock.findAll(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([monsterMockInstance]);
        });
    });

    describe('When a request is made to recover all disabled monsters', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(MonstersServicesMock, 'findAllDisabled').mockResolvedValue([monsterMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await MonstersControllersMock.findAllDisabled(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([monsterMockInstance]);
        });
    });

    describe('When a request is made to recover monster by ID', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(MonstersServicesMock, 'findOne').mockResolvedValue(monsterMockInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: monsterMockInstance._id as string };

            await MonstersControllersMock.findOne(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(monsterMockInstance);
        });
    });

    describe('When a request is made to update monster by ID', () => {
        const monsterMockUpdateInstance = {
            en: { ...monsterMockInstance.en, name: 'Dragon' },
            pt: { ...monsterMockInstance.pt, name: 'Dragão' },
        };

        const { _id: _, ...monsterMockPayload } = monsterMockInstance;

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(MonstersServicesMock, 'update').mockResolvedValue(monsterMockUpdateInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: monsterMockInstance._id as string };
            request.body = monsterMockPayload;

            await MonstersControllersMock.update(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(monsterMockUpdateInstance);
        });
    });

    describe('When a request is made to update availability monster by ID', () => {
        const responseMessageMock = {
            message: 'Monster {id} was deactivated',
            name: 'success',
        };

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(MonstersServicesMock, 'updateAvailability').mockResolvedValue(responseMessageMock);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: monsterMockInstance._id as string };
            request.query = { availability: 'false' };

            await MonstersControllersMock.updateAvailability(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(responseMessageMock);
        });
    });
});
