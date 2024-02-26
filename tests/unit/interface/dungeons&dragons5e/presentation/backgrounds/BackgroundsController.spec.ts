/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import BackgroundsController from 'src/interface/dungeons&dragons5e/presentation/backgrounds/BackgroundsController';

describe('Interface :: DungeonsAndDragons5e :: Presentation :: Backgrounds :: BackgroundsController', () => {
    let backgroundsController: BackgroundsController,
        getBackgroundOperation: any,
        getAllBackgroundsOperation: any,
        getDisabledBackgroundsOperation: any,
        toggleBackgroundsAvailabilityOperation: any;

    context('#get', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            getBackgroundOperation = { execute: sinon.spy(() => ({})) };
            getAllBackgroundsOperation = { execute: () => ({}) };
            getDisabledBackgroundsOperation = { execute: () => ({}) };
            toggleBackgroundsAvailabilityOperation = { execute: () => ({}) };

            backgroundsController = new BackgroundsController({
                getBackgroundOperation,
                getAllBackgroundsOperation,
                getDisabledBackgroundsOperation,
                toggleBackgroundsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            await backgroundsController.get(request, response);

            expect(getBackgroundOperation.execute).to.have.been.calledWith('123');
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

            getBackgroundOperation = { execute: () => ({}) };
            getAllBackgroundsOperation = { execute: sinon.spy(() => ({})) };
            getDisabledBackgroundsOperation = { execute: () => ({}) };
            toggleBackgroundsAvailabilityOperation = { execute: () => ({}) };

            backgroundsController = new BackgroundsController({
                getBackgroundOperation,
                getAllBackgroundsOperation,
                getDisabledBackgroundsOperation,
                toggleBackgroundsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await backgroundsController.getAll(request, response);

            expect(getAllBackgroundsOperation.execute).to.have.been.called();
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

            getBackgroundOperation = { execute: () => ({}) };
            getAllBackgroundsOperation = { execute: () => ({}) };
            getDisabledBackgroundsOperation = { execute: sinon.spy(() => ({})) };
            toggleBackgroundsAvailabilityOperation = { execute: () => ({}) };

            backgroundsController = new BackgroundsController({
                getBackgroundOperation,
                getAllBackgroundsOperation,
                getDisabledBackgroundsOperation,
                toggleBackgroundsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await backgroundsController.getDisabled(request, response);

            expect(getDisabledBackgroundsOperation.execute).to.have.been.called();
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

            getBackgroundOperation = { execute: () => ({}) };
            getAllBackgroundsOperation = { execute: () => ({}) };
            getDisabledBackgroundsOperation = { execute: () => ({}) };
            toggleBackgroundsAvailabilityOperation = { execute: sinon.spy(() => ({})) };

            backgroundsController = new BackgroundsController({
                getBackgroundOperation,
                getAllBackgroundsOperation,
                getDisabledBackgroundsOperation,
                toggleBackgroundsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { availability: 'false' };
            await backgroundsController.toggleAvailability(request, response);

            expect(
                toggleBackgroundsAvailabilityOperation.execute
            ).to.have.been.calledWith({
                id: '123',
                availability: false,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });
});
