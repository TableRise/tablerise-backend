/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import FeatsController from 'src/interface/dungeons&dragons5e/presentation/feats/FeatsController';

describe('Interface :: DungeonsAndDragons5e :: Presentation :: Feats :: FeatsController', () => {
    let featsController: FeatsController,
        getFeatOperation: any,
        getAllFeatsOperation: any,
        getDisabledFeatsOperation: any,
        toggleFeatsAvailabilityOperation: any;

    context('#get', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            getFeatOperation = { execute: sinon.spy(() => ({})) };
            getAllFeatsOperation = { execute: () => ({}) };
            getDisabledFeatsOperation = { execute: () => ({}) };
            toggleFeatsAvailabilityOperation = { execute: () => ({}) };

            featsController = new FeatsController({
                getFeatOperation,
                getAllFeatsOperation,
                getDisabledFeatsOperation,
                toggleFeatsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            await featsController.get(request, response);

            expect(getFeatOperation.execute).to.have.been.calledWith('123');
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

            getFeatOperation = { execute: () => ({}) };
            getAllFeatsOperation = { execute: sinon.spy(() => ({})) };
            getDisabledFeatsOperation = { execute: () => ({}) };
            toggleFeatsAvailabilityOperation = { execute: () => ({}) };

            featsController = new FeatsController({
                getFeatOperation,
                getAllFeatsOperation,
                getDisabledFeatsOperation,
                toggleFeatsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await featsController.getAll(request, response);

            expect(getAllFeatsOperation.execute).to.have.been.called();
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

            getFeatOperation = { execute: () => ({}) };
            getAllFeatsOperation = { execute: () => ({}) };
            getDisabledFeatsOperation = { execute: sinon.spy(() => ({})) };
            toggleFeatsAvailabilityOperation = { execute: () => ({}) };

            featsController = new FeatsController({
                getFeatOperation,
                getAllFeatsOperation,
                getDisabledFeatsOperation,
                toggleFeatsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await featsController.getDisabled(request, response);

            expect(getDisabledFeatsOperation.execute).to.have.been.called();
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

            getFeatOperation = { execute: () => ({}) };
            getAllFeatsOperation = { execute: () => ({}) };
            getDisabledFeatsOperation = { execute: () => ({}) };
            toggleFeatsAvailabilityOperation = { execute: sinon.spy(() => ({})) };

            featsController = new FeatsController({
                getFeatOperation,
                getAllFeatsOperation,
                getDisabledFeatsOperation,
                toggleFeatsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { availability: 'false' };
            await featsController.toggleAvailability(request, response);

            expect(toggleFeatsAvailabilityOperation.execute).to.have.been.calledWith({
                id: '123',
                availability: false,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });
});
