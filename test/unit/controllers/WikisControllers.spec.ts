import { Request, Response } from 'express';
import WikisModel from 'src/database/models/WikisModel';
import WikisServices from 'src/services/WikisService';
import WikisControllers from 'src/controllers/WikisControllers';
import { Wiki } from 'src/schemas/wikisValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import mocks from 'src/support/mocks';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: WikisControllers', () => {
    const WikisModelMock = new WikisModel();
    const WikisServicesMock = new WikisServices(WikisModelMock, logger);
    const WikisControllersMock = new WikisControllers(WikisServicesMock, logger);
    const wikiMockInstance = mocks.wiki.instance as Internacional<Wiki>;
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
