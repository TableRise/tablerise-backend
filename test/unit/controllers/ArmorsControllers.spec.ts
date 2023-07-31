import { Request, Response } from 'express';
import ArmorsModel from 'src/database/models/ArmorsModel';
import ArmorsServices from 'src/services/ArmorsServices';
import ArmorsControllers from 'src/controllers/ArmorsControllers';
import { Armor } from 'src/schemas/armorsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import mocks from 'src/support/mocks';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: ArmorsControllers', () => {
    const ArmorsModelMock = new ArmorsModel();
    const ArmorsServicesMock = new ArmorsServices(ArmorsModelMock, logger);
    const ArmorsControllersMock = new ArmorsControllers(ArmorsServicesMock, logger);
    const armorMockInstance = mocks.armor.instance as Internacional<Armor>;
    const request = {} as Request;
    const response = {} as Response;

    describe('When a request is made to recover all armors', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(ArmorsServicesMock, 'findAll').mockResolvedValue([armorMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await ArmorsControllersMock.findAll(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([armorMockInstance]);
        });
    });

    describe('When a request is made to recover armor armor by ID', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(ArmorsServicesMock, 'findOne').mockResolvedValue(armorMockInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: armorMockInstance._id as string };

            await ArmorsControllersMock.findOne(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(armorMockInstance);
        });
    });

    describe('When a request is made to update armor by ID', () => {
        const armorMockUpdateInstance = {
            en: { ...armorMockInstance.en, name: 'Olympo' },
            pt: { ...armorMockInstance.pt, name: 'Olympo' },
        };

        const { _id: _, ...armorMockPayload } = armorMockInstance;

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(ArmorsServicesMock, 'update').mockResolvedValue(armorMockUpdateInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: armorMockInstance._id as string };
            request.body = armorMockPayload;

            await ArmorsControllersMock.update(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(armorMockUpdateInstance);
        });
    });

    describe('When a request is made to delete a armor', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.end = jest.fn().mockReturnValue({});

            jest.spyOn(ArmorsServicesMock, 'delete').mockResolvedValue();
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should not return any data in response with status 204', async () => {
            request.params = { _id: armorMockInstance._id as string };

            await ArmorsControllersMock.delete(request, response);
            expect(response.status).toHaveBeenCalledWith(204);
            expect(response.end).toHaveBeenCalled();
        });
    });
});
