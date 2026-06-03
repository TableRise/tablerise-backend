/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import EquipmentController from 'src/interface/dungeons&dragons5e/presentation/equipment/EquipmentController';

describe('Interface :: DungeonsAndDragons5e :: Presentation :: Equipment :: EquipmentController', () => {
    let equipmentController: EquipmentController,
        getEquipmentOperation: any,
        getAllEquipmentOperation: any,
        getDisabledEquipmentOperation: any,
        toggleEquipmentAvailabilityOperation: any;

    context('#get', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            getEquipmentOperation = { execute: sinon.spy(() => ({})) };
            getAllEquipmentOperation = { execute: () => ({}) };
            getDisabledEquipmentOperation = { execute: () => ({}) };
            toggleEquipmentAvailabilityOperation = { execute: () => ({}) };

            equipmentController = new EquipmentController({
                getEquipmentOperation,
                getAllEquipmentOperation,
                getDisabledEquipmentOperation,
                toggleEquipmentAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            await equipmentController.get(request, response);

            expect(getEquipmentOperation.execute).to.have.been.calledWith('123');
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

            getEquipmentOperation = { execute: () => ({}) };
            getAllEquipmentOperation = { execute: sinon.spy(() => ({})) };
            getDisabledEquipmentOperation = { execute: () => ({}) };
            toggleEquipmentAvailabilityOperation = { execute: () => ({}) };

            equipmentController = new EquipmentController({
                getEquipmentOperation,
                getAllEquipmentOperation,
                getDisabledEquipmentOperation,
                toggleEquipmentAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await equipmentController.getAll(request, response);

            expect(getAllEquipmentOperation.execute).to.have.been.called();
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

            getEquipmentOperation = { execute: () => ({}) };
            getAllEquipmentOperation = { execute: () => ({}) };
            getDisabledEquipmentOperation = { execute: sinon.spy(() => ({})) };
            toggleEquipmentAvailabilityOperation = { execute: () => ({}) };

            equipmentController = new EquipmentController({
                getEquipmentOperation,
                getAllEquipmentOperation,
                getDisabledEquipmentOperation,
                toggleEquipmentAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await equipmentController.getDisabled(request, response);

            expect(getDisabledEquipmentOperation.execute).to.have.been.called();
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

            getEquipmentOperation = { execute: () => ({}) };
            getAllEquipmentOperation = { execute: () => ({}) };
            getDisabledEquipmentOperation = { execute: () => ({}) };
            toggleEquipmentAvailabilityOperation = { execute: sinon.spy(() => ({})) };

            equipmentController = new EquipmentController({
                getEquipmentOperation,
                getAllEquipmentOperation,
                getDisabledEquipmentOperation,
                toggleEquipmentAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { availability: 'false' };
            await equipmentController.toggleAvailability(request, response);

            expect(toggleEquipmentAvailabilityOperation.execute).to.have.been.calledWith({
                id: '123',
                availability: false,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });
});
