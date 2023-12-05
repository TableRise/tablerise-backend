import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import ItemsController from 'src/interface/dungeons&dragons5e/presentation/items/ItemsController';

describe('Interface :: DungeonsAndDragons5e :: Presentation :: Items :: ItemsController', () => {
    let itemsController: ItemsController,
        getItemOperation: any,
        getAllItemsOperation: any,
        getDisabledItemsOperation: any,
        toggleItemsAvailabilityOperation: any;

    context('#get', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            getItemOperation = { execute: sinon.spy(() => ({})) };
            getAllItemsOperation = { execute: () => ({}) };
            getDisabledItemsOperation = { execute: () => ({}) };
            toggleItemsAvailabilityOperation = { execute: () => ({}) };

            itemsController = new ItemsController({
                getItemOperation,
                getAllItemsOperation,
                getDisabledItemsOperation,
                toggleItemsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            await itemsController.get(request, response);

            expect(getItemOperation.execute).to.have.been.calledWith('123');
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

            getItemOperation = { execute: () => ({}) };
            getAllItemsOperation = { execute: sinon.spy(() => ({})) };
            getDisabledItemsOperation = { execute: () => ({}) };
            toggleItemsAvailabilityOperation = { execute: () => ({}) };

            itemsController = new ItemsController({
                getItemOperation,
                getAllItemsOperation,
                getDisabledItemsOperation,
                toggleItemsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await itemsController.getAll(request, response);

            expect(getAllItemsOperation.execute).to.have.been.called();
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

            getItemOperation = { execute: () => ({}) };
            getAllItemsOperation = { execute: () => ({}) };
            getDisabledItemsOperation = { execute: sinon.spy(() => ({})) };
            toggleItemsAvailabilityOperation = { execute: () => ({}) };

            itemsController = new ItemsController({
                getItemOperation,
                getAllItemsOperation,
                getDisabledItemsOperation,
                toggleItemsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await itemsController.getDisabled(request, response);

            expect(getDisabledItemsOperation.execute).to.have.been.called();
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

            getItemOperation = { execute: () => ({}) };
            getAllItemsOperation = { execute: () => ({}) };
            getDisabledItemsOperation = { execute: () => ({}) };
            toggleItemsAvailabilityOperation = { execute: sinon.spy(() => ({})) };

            itemsController = new ItemsController({
                getItemOperation,
                getAllItemsOperation,
                getDisabledItemsOperation,
                toggleItemsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { availability: 'false' };
            await itemsController.toggleAvailability(request, response);

            expect(toggleItemsAvailabilityOperation.execute).to.have.been.calledWith({
                id: '123',
                availability: false,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });
});
