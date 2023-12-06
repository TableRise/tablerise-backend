import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import RealmsController from 'src/interface/dungeons&dragons5e/presentation/realms/RealmsController';

describe('Interface :: DungeonsAndDragons5e :: Presentation :: Realms :: RealmsController', () => {
    let realmsController: RealmsController,
        getRealmOperation: any,
        getAllRealmsOperation: any,
        getDisabledRealmsOperation: any,
        toggleRealmsAvailabilityOperation: any;

    context('#get', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            getRealmOperation = { execute: sinon.spy(() => ({})) };
            getAllRealmsOperation = { execute: () => ({}) };
            getDisabledRealmsOperation = { execute: () => ({}) };
            toggleRealmsAvailabilityOperation = { execute: () => ({}) };

            realmsController = new RealmsController({
                getRealmOperation,
                getAllRealmsOperation,
                getDisabledRealmsOperation,
                toggleRealmsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            await realmsController.get(request, response);

            expect(getRealmOperation.execute).to.have.been.calledWith('123');
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

            getRealmOperation = { execute: () => ({}) };
            getAllRealmsOperation = { execute: sinon.spy(() => ({})) };
            getDisabledRealmsOperation = { execute: () => ({}) };
            toggleRealmsAvailabilityOperation = { execute: () => ({}) };

            realmsController = new RealmsController({
                getRealmOperation,
                getAllRealmsOperation,
                getDisabledRealmsOperation,
                toggleRealmsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await realmsController.getAll(request, response);

            expect(getAllRealmsOperation.execute).to.have.been.called();
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

            getRealmOperation = { execute: () => ({}) };
            getAllRealmsOperation = { execute: () => ({}) };
            getDisabledRealmsOperation = { execute: sinon.spy(() => ({})) };
            toggleRealmsAvailabilityOperation = { execute: () => ({}) };

            realmsController = new RealmsController({
                getRealmOperation,
                getAllRealmsOperation,
                getDisabledRealmsOperation,
                toggleRealmsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await realmsController.getDisabled(request, response);

            expect(getDisabledRealmsOperation.execute).to.have.been.called();
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

            getRealmOperation = { execute: () => ({}) };
            getAllRealmsOperation = { execute: () => ({}) };
            getDisabledRealmsOperation = { execute: () => ({}) };
            toggleRealmsAvailabilityOperation = { execute: sinon.spy(() => ({})) };

            realmsController = new RealmsController({
                getRealmOperation,
                getAllRealmsOperation,
                getDisabledRealmsOperation,
                toggleRealmsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { availability: 'false' };
            await realmsController.toggleAvailability(request, response);

            expect(toggleRealmsAvailabilityOperation.execute).to.have.been.calledWith({
                id: '123',
                availability: false,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });
});
