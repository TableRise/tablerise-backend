/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import GodsController from 'src/interface/dungeons&dragons5e/presentation/gods/GodsController';

describe('Interface :: DungeonsAndDragons5e :: Presentation :: Gods :: GodsController', () => {
    let godsController: GodsController,
        getGodOperation: any,
        getAllGodsOperation: any,
        getDisabledGodsOperation: any,
        toggleGodsAvailabilityOperation: any;

    context('#get', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            getGodOperation = { execute: sinon.spy(() => ({})) };
            getAllGodsOperation = { execute: () => ({}) };
            getDisabledGodsOperation = { execute: () => ({}) };
            toggleGodsAvailabilityOperation = { execute: () => ({}) };

            godsController = new GodsController({
                getGodOperation,
                getAllGodsOperation,
                getDisabledGodsOperation,
                toggleGodsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            await godsController.get(request, response);

            expect(getGodOperation.execute).to.have.been.calledWith('123');
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

            getGodOperation = { execute: () => ({}) };
            getAllGodsOperation = { execute: sinon.spy(() => ({})) };
            getDisabledGodsOperation = { execute: () => ({}) };
            toggleGodsAvailabilityOperation = { execute: () => ({}) };

            godsController = new GodsController({
                getGodOperation,
                getAllGodsOperation,
                getDisabledGodsOperation,
                toggleGodsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await godsController.getAll(request, response);

            expect(getAllGodsOperation.execute).to.have.been.called();
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

            getGodOperation = { execute: () => ({}) };
            getAllGodsOperation = { execute: () => ({}) };
            getDisabledGodsOperation = { execute: sinon.spy(() => ({})) };
            toggleGodsAvailabilityOperation = { execute: () => ({}) };

            godsController = new GodsController({
                getGodOperation,
                getAllGodsOperation,
                getDisabledGodsOperation,
                toggleGodsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await godsController.getDisabled(request, response);

            expect(getDisabledGodsOperation.execute).to.have.been.called();
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

            getGodOperation = { execute: () => ({}) };
            getAllGodsOperation = { execute: () => ({}) };
            getDisabledGodsOperation = { execute: () => ({}) };
            toggleGodsAvailabilityOperation = { execute: sinon.spy(() => ({})) };

            godsController = new GodsController({
                getGodOperation,
                getAllGodsOperation,
                getDisabledGodsOperation,
                toggleGodsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { availability: 'false' };
            await godsController.toggleAvailability(request, response);

            expect(toggleGodsAvailabilityOperation.execute).to.have.been.calledWith({
                id: '123',
                availability: false,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });
});
