/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import ArmorsController from 'src/interface/dungeons&dragons5e/presentation/armors/ArmorsController';

describe('Interface :: DungeonsAndDragons5e :: Presentation :: Armors :: ArmorsController', () => {
    let armorsController: ArmorsController,
        getArmorOperation: any,
        getAllArmorsOperation: any,
        getDisabledArmorsOperation: any,
        toggleArmorsAvailabilityOperation: any;

    context('#get', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            getArmorOperation = { execute: sinon.spy(() => ({})) };
            getAllArmorsOperation = { execute: () => ({}) };
            getDisabledArmorsOperation = { execute: () => ({}) };
            toggleArmorsAvailabilityOperation = { execute: () => ({}) };

            armorsController = new ArmorsController({
                getArmorOperation,
                getAllArmorsOperation,
                getDisabledArmorsOperation,
                toggleArmorsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            await armorsController.get(request, response);

            expect(getArmorOperation.execute).to.have.been.calledWith('123');
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

            getArmorOperation = { execute: () => ({}) };
            getAllArmorsOperation = { execute: sinon.spy(() => ({})) };
            getDisabledArmorsOperation = { execute: () => ({}) };
            toggleArmorsAvailabilityOperation = { execute: () => ({}) };

            armorsController = new ArmorsController({
                getArmorOperation,
                getAllArmorsOperation,
                getDisabledArmorsOperation,
                toggleArmorsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await armorsController.getAll(request, response);

            expect(getAllArmorsOperation.execute).to.have.been.called();
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

            getArmorOperation = { execute: () => ({}) };
            getAllArmorsOperation = { execute: () => ({}) };
            getDisabledArmorsOperation = { execute: sinon.spy(() => ({})) };
            toggleArmorsAvailabilityOperation = { execute: () => ({}) };

            armorsController = new ArmorsController({
                getArmorOperation,
                getAllArmorsOperation,
                getDisabledArmorsOperation,
                toggleArmorsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await armorsController.getDisabled(request, response);

            expect(getDisabledArmorsOperation.execute).to.have.been.called();
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

            getArmorOperation = { execute: () => ({}) };
            getAllArmorsOperation = { execute: () => ({}) };
            getDisabledArmorsOperation = { execute: () => ({}) };
            toggleArmorsAvailabilityOperation = { execute: sinon.spy(() => ({})) };

            armorsController = new ArmorsController({
                getArmorOperation,
                getAllArmorsOperation,
                getDisabledArmorsOperation,
                toggleArmorsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { availability: 'false' };
            await armorsController.toggleAvailability(request, response);

            expect(toggleArmorsAvailabilityOperation.execute).to.have.been.calledWith({
                id: '123',
                availability: false,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });
});
