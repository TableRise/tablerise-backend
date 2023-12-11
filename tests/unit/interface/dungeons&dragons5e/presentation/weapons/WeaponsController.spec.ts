import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import WeaponsController from 'src/interface/dungeons&dragons5e/presentation/weapons/WeaponsController';

describe('Interface :: DungeonsAndDragons5e :: Presentation :: Weapons :: WeaponsController', () => {
    let weaponsController: WeaponsController,
        getWeaponOperation: any,
        getAllWeaponsOperation: any,
        getDisabledWeaponsOperation: any,
        toggleWeaponsAvailabilityOperation: any;

    context('#get', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            getWeaponOperation = { execute: sinon.spy(() => ({})) };
            getAllWeaponsOperation = { execute: () => ({}) };
            getDisabledWeaponsOperation = { execute: () => ({}) };
            toggleWeaponsAvailabilityOperation = { execute: () => ({}) };

            weaponsController = new WeaponsController({
                getWeaponOperation,
                getAllWeaponsOperation,
                getDisabledWeaponsOperation,
                toggleWeaponsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            await weaponsController.get(request, response);

            expect(getWeaponOperation.execute).to.have.been.calledWith('123');
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

            getWeaponOperation = { execute: () => ({}) };
            getAllWeaponsOperation = { execute: sinon.spy(() => ({})) };
            getDisabledWeaponsOperation = { execute: () => ({}) };
            toggleWeaponsAvailabilityOperation = { execute: () => ({}) };

            weaponsController = new WeaponsController({
                getWeaponOperation,
                getAllWeaponsOperation,
                getDisabledWeaponsOperation,
                toggleWeaponsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await weaponsController.getAll(request, response);

            expect(getAllWeaponsOperation.execute).to.have.been.called();
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

            getWeaponOperation = { execute: () => ({}) };
            getAllWeaponsOperation = { execute: () => ({}) };
            getDisabledWeaponsOperation = { execute: sinon.spy(() => ({})) };
            toggleWeaponsAvailabilityOperation = { execute: () => ({}) };

            weaponsController = new WeaponsController({
                getWeaponOperation,
                getAllWeaponsOperation,
                getDisabledWeaponsOperation,
                toggleWeaponsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await weaponsController.getDisabled(request, response);

            expect(getDisabledWeaponsOperation.execute).to.have.been.called();
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

            getWeaponOperation = { execute: () => ({}) };
            getAllWeaponsOperation = { execute: () => ({}) };
            getDisabledWeaponsOperation = { execute: () => ({}) };
            toggleWeaponsAvailabilityOperation = { execute: sinon.spy(() => ({})) };

            weaponsController = new WeaponsController({
                getWeaponOperation,
                getAllWeaponsOperation,
                getDisabledWeaponsOperation,
                toggleWeaponsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { availability: 'false' };
            await weaponsController.toggleAvailability(request, response);

            expect(toggleWeaponsAvailabilityOperation.execute).to.have.been.calledWith({
                id: '123',
                availability: false,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });
});