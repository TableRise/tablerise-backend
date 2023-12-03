import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import MagicItemsController from 'src/interface/dungeons&dragons5e/presentation/magicItems/MagicItemsController';

describe('Interface :: DungeonsAndDragons5e :: Presentation :: MagicItems :: MagicItemsController', () => {
    let magicItemsController: MagicItemsController,
        getMagicItemOperation: any,
        getAllMagicItemsOperation: any,
        getDisabledMagicItemsOperation: any,
        toggleMagicItemsAvailabilityOperation: any;

    context('#get', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            getMagicItemOperation = { execute: sinon.spy(() => ({})) };
            getAllMagicItemsOperation = { execute: () => ({}) };
            getDisabledMagicItemsOperation = { execute: () => ({}) };
            toggleMagicItemsAvailabilityOperation = { execute: () => ({}) };

            magicItemsController = new MagicItemsController({
                getMagicItemOperation,
                getAllMagicItemsOperation,
                getDisabledMagicItemsOperation,
                toggleMagicItemsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            await magicItemsController.get(request, response);

            expect(getMagicItemOperation.execute).to.have.been.calledWith('123');
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

            getMagicItemOperation = { execute: () => ({}) };
            getAllMagicItemsOperation = { execute: sinon.spy(() => ({})) };
            getDisabledMagicItemsOperation = { execute: () => ({}) };
            toggleMagicItemsAvailabilityOperation = { execute: () => ({}) };

            magicItemsController = new MagicItemsController({
                getMagicItemOperation,
                getAllMagicItemsOperation,
                getDisabledMagicItemsOperation,
                toggleMagicItemsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await magicItemsController.getAll(request, response);

            expect(getAllMagicItemsOperation.execute).to.have.been.called();
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

            getMagicItemOperation = { execute: () => ({}) };
            getAllMagicItemsOperation = { execute: () => ({}) };
            getDisabledMagicItemsOperation = { execute: sinon.spy(() => ({})) };
            toggleMagicItemsAvailabilityOperation = { execute: () => ({}) };

            magicItemsController = new MagicItemsController({
                getMagicItemOperation,
                getAllMagicItemsOperation,
                getDisabledMagicItemsOperation,
                toggleMagicItemsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await magicItemsController.getDisabled(request, response);

            expect(getDisabledMagicItemsOperation.execute).to.have.been.called();
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

            getMagicItemOperation = { execute: () => ({}) };
            getAllMagicItemsOperation = { execute: () => ({}) };
            getDisabledMagicItemsOperation = { execute: () => ({}) };
            toggleMagicItemsAvailabilityOperation = { execute: sinon.spy(() => ({})) };

            magicItemsController = new MagicItemsController({
                getMagicItemOperation,
                getAllMagicItemsOperation,
                getDisabledMagicItemsOperation,
                toggleMagicItemsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { availability: 'false' };
            await magicItemsController.toggleAvailability(request, response);

            expect(toggleMagicItemsAvailabilityOperation.execute).to.have.been.calledWith(
                {
                    id: '123',
                    availability: false,
                }
            );
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });
});
