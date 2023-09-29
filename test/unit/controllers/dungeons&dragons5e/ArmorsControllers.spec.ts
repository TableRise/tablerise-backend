import DatabaseManagement from '@tablerise/database-management';
import { Request, Response } from 'express';
import ArmorsServices from 'src/services/dungeons&dragons5e/ArmorsServices';
import ArmorsControllers from 'src/controllers/dungeons&dragons5e/ArmorsControllers';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import ValidateData from 'src/services/helpers/ValidateData';

import logger from '@tablerise/dynamic-logger';
import { Armor } from 'src/schemas/dungeons&dragons5e/armorsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import schema from 'src/schemas';

describe('Services :: DungeonsAndDragons5e :: ArmorsControllers', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new ValidateData();

    const ArmorsModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'Armors');
    const ArmorsServicesMock = new ArmorsServices(
        ArmorsModelMock,
        logger,
        ValidateDataMock,
        schema['dungeons&dragons5e']
    );
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

        afterAll(() => jest.clearAllMocks());

        it('should return correct data in response json with status 200', async () => {
            await ArmorsControllersMock.findAll(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([armorMockInstance]);
        });
    });

    describe('When a request is made to recover all disabled armors', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(ArmorsServicesMock, 'findAllDisabled').mockResolvedValue([armorMockInstance]);
        });

        afterAll(() => jest.clearAllMocks());

        it('should return correct data in response json with status 200', async () => {
            await ArmorsControllersMock.findAllDisabled(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([armorMockInstance]);
        });
    });

    describe('When a request is made to recover armor by ID', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(ArmorsServicesMock, 'findOne').mockResolvedValue(armorMockInstance);
        });

        afterAll(() => jest.clearAllMocks());

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: armorMockInstance._id as string };

            await ArmorsControllersMock.findOne(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(armorMockInstance);
        });
    });

    describe('When a request is made to update armor by ID', () => {
        const armorMockUpdateInstance = {
            en: { ...armorMockInstance.en, name: 'Clothes' },
            pt: { ...armorMockInstance.pt, name: 'Roupas' },
        };

        const { _id: _, ...armorMockPayload } = armorMockInstance;

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(ArmorsServicesMock, 'update').mockResolvedValue(armorMockUpdateInstance);
        });

        afterAll(() => jest.clearAllMocks());

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: armorMockInstance._id as string };
            request.body = armorMockPayload;

            await ArmorsControllersMock.update(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(armorMockUpdateInstance);
        });
    });

    describe('When a request is made to update availability armor by ID', () => {
        const responseMessageMock = {
            message: 'Armor {id} was deactivated',
            name: 'success',
        };

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(ArmorsServicesMock, 'updateAvailability').mockResolvedValue(responseMessageMock);
        });

        afterAll(() => jest.clearAllMocks());

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: armorMockInstance._id as string };
            request.query = { availability: 'false' };

            await ArmorsControllersMock.updateAvailability(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(responseMessageMock);
        });
    });
});
