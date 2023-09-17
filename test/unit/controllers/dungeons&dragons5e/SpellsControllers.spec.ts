import DatabaseManagement, { DnDSpell, Internacional, SchemasDnDType } from '@tablerise/database-management';
import { Request, Response } from 'express';
import SpellsServices from 'src/services/dungeons&dragons5e/SpellsServices';
import SpellsControllers from 'src/controllers/dungeons&dragons5e/SpellsControllers';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import ValidateData from 'src/support/helpers/ValidateData';

import logger from '@tablerise/dynamic-logger';

describe('Services :: DungeonsAndDragons5e :: SpellsControllers', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new ValidateData(logger);

    const SpellsModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'Spells');
    const SpellsSchemaMock = DM_MOCK.schemaInstance('dungeons&dragons5e') as SchemasDnDType;
    const SpellsServicesMock = new SpellsServices(SpellsModelMock, logger, ValidateDataMock, SpellsSchemaMock);
    const SpellsControllersMock = new SpellsControllers(SpellsServicesMock, logger);

    const spellMockInstance = mocks.spell.instance as Internacional<DnDSpell>;
    const request = {} as Request;
    const response = {} as Response;

    describe('When a request is made to recover all spells', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(SpellsServicesMock, 'findAll').mockResolvedValue([spellMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await SpellsControllersMock.findAll(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([spellMockInstance]);
        });
    });

    describe('When a request is made to recover all spells disabled', () => {
        spellMockInstance.active = false;
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(SpellsServicesMock, 'findAllDisabled').mockResolvedValue([spellMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await SpellsControllersMock.findAllDisabled(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([spellMockInstance]);
        });
    });

    describe('When a request is made to recover spell by ID', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(SpellsServicesMock, 'findOne').mockResolvedValue(spellMockInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: spellMockInstance._id as string };

            await SpellsControllersMock.findOne(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(spellMockInstance);
        });
    });

    describe('When a request is made to update spell by ID', () => {
        const spellMockUpdateInstance = {
            en: { ...spellMockInstance.en, name: 'Bard' },
            pt: { ...spellMockInstance.pt, name: 'Bardo' },
        };

        const { _id: _, ...spellMockPayload } = spellMockInstance;

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(SpellsServicesMock, 'update').mockResolvedValue(spellMockUpdateInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: spellMockInstance._id as string };
            request.body = spellMockPayload;

            await SpellsControllersMock.update(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(spellMockUpdateInstance);
        });
    });

    describe('When a request is made to update availability spell by ID', () => {
        const responseMessageMock = {
            message: 'Spell {id} was deactivated',
            name: 'success',
        };

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(SpellsServicesMock, 'updateAvailability').mockResolvedValue(responseMessageMock);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: spellMockInstance._id as string };
            request.query = { availability: 'false' };

            await SpellsControllersMock.updateAvailability(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(responseMessageMock);
        });
    });
});
