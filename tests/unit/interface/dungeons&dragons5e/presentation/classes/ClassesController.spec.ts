/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import ClassesController from 'src/interface/dungeons&dragons5e/presentation/classes/ClassesController';

describe('Interface :: DungeonsAndDragons5e :: Presentation :: Classes :: ClassesController', () => {
    let classesController: ClassesController,
        getClassOperation: any,
        getAllClassesOperation: any,
        getDisabledClassesOperation: any,
        toggleClassesAvailabilityOperation: any;

    context('#get', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            getClassOperation = { execute: sinon.spy(() => ({})) };
            getAllClassesOperation = { execute: () => ({}) };
            getDisabledClassesOperation = { execute: () => ({}) };
            toggleClassesAvailabilityOperation = { execute: () => ({}) };

            classesController = new ClassesController({
                getClassOperation,
                getAllClassesOperation,
                getDisabledClassesOperation,
                toggleClassesAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            await classesController.get(request, response);

            expect(getClassOperation.execute).to.have.been.calledWith('123');
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

            getClassOperation = { execute: () => ({}) };
            getAllClassesOperation = { execute: sinon.spy(() => ({})) };
            getDisabledClassesOperation = { execute: () => ({}) };
            toggleClassesAvailabilityOperation = { execute: () => ({}) };

            classesController = new ClassesController({
                getClassOperation,
                getAllClassesOperation,
                getDisabledClassesOperation,
                toggleClassesAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await classesController.getAll(request, response);

            expect(getAllClassesOperation.execute).to.have.been.called();
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

            getClassOperation = { execute: () => ({}) };
            getAllClassesOperation = { execute: () => ({}) };
            getDisabledClassesOperation = { execute: sinon.spy(() => ({})) };
            toggleClassesAvailabilityOperation = { execute: () => ({}) };

            classesController = new ClassesController({
                getClassOperation,
                getAllClassesOperation,
                getDisabledClassesOperation,
                toggleClassesAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await classesController.getDisabled(request, response);

            expect(getDisabledClassesOperation.execute).to.have.been.called();
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

            getClassOperation = { execute: () => ({}) };
            getAllClassesOperation = { execute: () => ({}) };
            getDisabledClassesOperation = { execute: () => ({}) };
            toggleClassesAvailabilityOperation = { execute: sinon.spy(() => ({})) };

            classesController = new ClassesController({
                getClassOperation,
                getAllClassesOperation,
                getDisabledClassesOperation,
                toggleClassesAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { availability: 'false' };
            await classesController.toggleAvailability(request, response);

            expect(toggleClassesAvailabilityOperation.execute).to.have.been.calledWith({
                id: '123',
                availability: false,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });
});
