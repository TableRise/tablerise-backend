import { Request, Response } from 'express';
import MonstersModel from 'src/database/models/MonstersModel';
import MonstersServices from 'src/services/MonstersServices';
import MonstersControllers from 'src/controllers/MonstersControllers';
import { Monster } from 'src/schemas/monstersValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import mocks from 'src/support/mocks';

describe('Services :: MonstersControllers', () => {
    const MonstersModelMock = new MonstersModel();
    const MonstersServicesMock = new MonstersServices(MonstersModelMock);
    const MonstersControllersMock = new MonstersControllers(MonstersServicesMock);
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

    describe('When a request is made to delete a monster', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.end = jest.fn().mockReturnValue({});

            jest.spyOn(MonstersServicesMock, 'delete').mockResolvedValue();
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should not return any data in response with status 204', async () => {
            request.params = { _id: monsterMockInstance._id as string };

            await MonstersControllersMock.delete(request, response);
            expect(response.status).toHaveBeenCalledWith(204);
            expect(response.end).toHaveBeenCalled();
        });
    });
});
