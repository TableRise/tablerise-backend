import { Request, Response } from 'express';
import SpellsModel from 'src/database/models/SpellsModel';
import SpellsServices from 'src/services/SpellsServices';
import SpellsControllers from 'src/controllers/SpellsControllers';
import { Spell } from 'src/schemas/spellsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import mocks from 'src/support/mocks';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: SpellsControllers', () => {
    const SpellsModelMock = new SpellsModel();
    const SpellsServicesMock = new SpellsServices(SpellsModelMock, logger);
    const SpellsControllersMock = new SpellsControllers(SpellsServicesMock, logger);
    const spellMockInstance = mocks.spell.instance as Internacional<Spell>;
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

    describe('When a request is made to update spell spell by ID', () => {
        const spellMockUpdateInstance = {
            en: { ...spellMockInstance.en, name: 'Fire' },
            pt: { ...spellMockInstance.pt, name: 'Fogo' },
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

    describe('When a request is made to delete a spell', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.end = jest.fn().mockReturnValue({});

            jest.spyOn(SpellsServicesMock, 'delete').mockResolvedValue();
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should not return any data in response with status 204', async () => {
            request.params = { _id: spellMockInstance._id as string };

            await SpellsControllersMock.delete(request, response);
            expect(response.status).toHaveBeenCalledWith(204);
            expect(response.end).toHaveBeenCalled();
        });
    });
});
