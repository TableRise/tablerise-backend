import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import RacesController from 'src/interface/dungeons&dragons5e/presentation/races/RacesController';

describe('Interface :: DungeonsAndDragons5e :: Presentation :: Races :: RacesController', () => {
    let racesController: RacesController,
        getRaceOperation: any,
        getAllRacesOperation: any,
        getDisabledRacesOperation: any,
        toggleRacesAvailabilityOperation: any;

    context('#get', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            getRaceOperation = { execute: sinon.spy(() => ({})) };
            getAllRacesOperation = { execute: () => ({}) };
            getDisabledRacesOperation = { execute: () => ({}) };
            toggleRacesAvailabilityOperation = { execute: () => ({}) };

            racesController = new RacesController({
                getRaceOperation,
                getAllRacesOperation,
                getDisabledRacesOperation,
                toggleRacesAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            await racesController.get(request, response);

            expect(getRaceOperation.execute).to.have.been.calledWith('123');
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

            getRaceOperation = { execute: () => ({}) };
            getAllRacesOperation = { execute: sinon.spy(() => ({})) };
            getDisabledRacesOperation = { execute: () => ({}) };
            toggleRacesAvailabilityOperation = { execute: () => ({}) };

            racesController = new RacesController({
                getRaceOperation,
                getAllRacesOperation,
                getDisabledRacesOperation,
                toggleRacesAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await racesController.getAll(request, response);

            expect(getAllRacesOperation.execute).to.have.been.called();
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

            getRaceOperation = { execute: () => ({}) };
            getAllRacesOperation = { execute: () => ({}) };
            getDisabledRacesOperation = { execute: sinon.spy(() => ({})) };
            toggleRacesAvailabilityOperation = { execute: () => ({}) };

            racesController = new RacesController({
                getRaceOperation,
                getAllRacesOperation,
                getDisabledRacesOperation,
                toggleRacesAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await racesController.getDisabled(request, response);

            expect(getDisabledRacesOperation.execute).to.have.been.called();
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

            getRaceOperation = { execute: () => ({}) };
            getAllRacesOperation = { execute: () => ({}) };
            getDisabledRacesOperation = { execute: () => ({}) };
            toggleRacesAvailabilityOperation = { execute: sinon.spy(() => ({})) };

            racesController = new RacesController({
                getRaceOperation,
                getAllRacesOperation,
                getDisabledRacesOperation,
                toggleRacesAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { availability: 'false' };
            await racesController.toggleAvailability(request, response);

            expect(toggleRacesAvailabilityOperation.execute).to.have.been.calledWith({
                id: '123',
                availability: false,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });
});
