import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import WikisController from 'src/interface/dungeons&dragons5e/presentation/wikis/WikisController';

describe('Interface :: DungeonsAndDragons5e :: Presentation :: Wikis :: WikisController', () => {
    let wikisController: WikisController,
        getWikiOperation: any,
        getAllWikisOperation: any,
        getDisabledWikisOperation: any,
        toggleWikisAvailabilityOperation: any;

    context('#get', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            getWikiOperation = { execute: sinon.spy(() => ({})) };
            getAllWikisOperation = { execute: () => ({}) };
            getDisabledWikisOperation = { execute: () => ({}) };
            toggleWikisAvailabilityOperation = { execute: () => ({}) };

            wikisController = new WikisController({
                getWikiOperation,
                getAllWikisOperation,
                getDisabledWikisOperation,
                toggleWikisAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            await wikisController.get(request, response);

            expect(getWikiOperation.execute).to.have.been.calledWith('123');
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#getAll', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            getWikiOperation = { execute: () => ({}) };
            getAllWikisOperation = { execute: sinon.spy(() => ({})) };
            getDisabledWikisOperation = { execute: () => ({}) };
            toggleWikisAvailabilityOperation = { execute: () => ({}) };

            wikisController = new WikisController({
                getWikiOperation,
                getAllWikisOperation,
                getDisabledWikisOperation,
                toggleWikisAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await wikisController.getAll(request, response);

            expect(getAllWikisOperation.execute).to.have.been.called();
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#getDisabled', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            getWikiOperation = { execute: () => ({}) };
            getAllWikisOperation = { execute: () => ({}) };
            getDisabledWikisOperation = { execute: sinon.spy(() => ({})) };
            toggleWikisAvailabilityOperation = { execute: () => ({}) };

            wikisController = new WikisController({
                getWikiOperation,
                getAllWikisOperation,
                getDisabledWikisOperation,
                toggleWikisAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await wikisController.getDisabled(request, response);

            expect(getDisabledWikisOperation.execute).to.have.been.called();
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#toggleAvailability', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            getWikiOperation = { execute: () => ({}) };
            getAllWikisOperation = { execute: () => ({}) };
            getDisabledWikisOperation = { execute: () => ({}) };
            toggleWikisAvailabilityOperation = { execute: sinon.spy(() => ({})) };

            wikisController = new WikisController({
                getWikiOperation,
                getAllWikisOperation,
                getDisabledWikisOperation,
                toggleWikisAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { availability: 'false' };
            await wikisController.toggleAvailability(request, response);

            expect(toggleWikisAvailabilityOperation.execute).to.have.been.calledWith({
                id: '123',
                availability: false,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });
});