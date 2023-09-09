import DatabaseManagement, { DnDWiki, Internacional } from '@tablerise/database-management';
import { Request, Response } from 'express';
import WikisServices from 'src/services/dungeons&dragons5e/WikisService';
import WikisControllers from 'src/controllers/dungeons&dragons5e/WikisControllers';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import ValidateData from 'src/support/helpers/ValidateData';

import logger from '@tablerise/dynamic-logger';

describe('Services :: DungeonsAndDragons5e :: WikisControllers', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new ValidateData(logger);

    const WikisModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'System');
    const WikisSchemaMock = DM_MOCK.schemaInstance('dungeons&dragons5e');
    const WikisServicesMock = new WikisServices(WikisModelMock, logger, ValidateDataMock, WikisSchemaMock);
    const WikisControllersMock = new WikisControllers(WikisServicesMock, logger);

    const wikiMockInstance = mocks.wiki.instance as Internacional<DnDWiki>;
    const request = {} as Request;
    const response = {} as Response;

    describe('When a request is made to recover all wikis', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(WikisServicesMock, 'findAll').mockResolvedValue([wikiMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await WikisControllersMock.findAll(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([wikiMockInstance]);
        });
    });

    describe('When a request is made to recover all disabled wikis', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(WikisServicesMock, 'findAllDisabled').mockResolvedValue([wikiMockInstance]);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            await WikisControllersMock.findAllDisabled(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith([wikiMockInstance]);
        });
    });

    describe('When a request is made to recover wiki by ID', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(WikisServicesMock, 'findOne').mockResolvedValue(wikiMockInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: wikiMockInstance._id as string };

            await WikisControllersMock.findOne(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(wikiMockInstance);
        });
    });

    describe('When a request is made to update wiki by ID', () => {
        const wikiMockUpdateInstance = {
            en: { ...wikiMockInstance.en, title: 'Wiki' },
            pt: { ...wikiMockInstance.pt, title: 'Wiki' },
        };

        const { _id: _, ...wikiMockPayload } = wikiMockInstance;

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(WikisServicesMock, 'update').mockResolvedValue(wikiMockUpdateInstance);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: wikiMockInstance._id as string };
            request.body = wikiMockPayload;

            await WikisControllersMock.update(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(wikiMockUpdateInstance);
        });
    });

    describe('When a request is made to update availability wiki by ID', () => {
        const responseMessageMock = {
            message: 'Wiki {id} was deactivated',
            name: 'success',
        };

        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(WikisServicesMock, 'updateAvailability').mockResolvedValue(responseMessageMock);
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { _id: wikiMockInstance._id as string };
            request.query = { availability: 'false' };

            await WikisControllersMock.updateAvailability(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(responseMessageMock);
        });
    });
});
