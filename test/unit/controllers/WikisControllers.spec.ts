import { Request, Response } from 'express';
import WikisModel from 'src/database/models/WikisModel';
import WikisServices from 'src/services/WikisService';
import WikisControllers from 'src/controllers/WikisControllers';
import { Wiki } from 'src/schemas/wikisValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import mocks from 'src/support/mocks';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: SpellsControllers', () => {
    const WikisModelMock = new WikisModel();
    const ValidateDataMock = new ValidateData(logger);
    const WikisServicesMock = new WikisServices(WikisModelMock, logger, ValidateDataMock);
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

    describe('When a request is made to recover spell by ID', () => {
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

    describe('When a request is made to delete a wiki', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.end = jest.fn().mockReturnValue({});

            jest.spyOn(WikisServicesMock, 'delete').mockResolvedValue();
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should not return any data in response with status 204', async () => {
            request.params = { _id: wikiMockInstance._id as string };

            await WikisControllersMock.delete(request, response);
            expect(response.status).toHaveBeenCalledWith(204);
            expect(response.end).toHaveBeenCalled();
        });
    });
});
