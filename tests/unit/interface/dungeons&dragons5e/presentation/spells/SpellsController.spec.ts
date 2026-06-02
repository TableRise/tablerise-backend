import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import SpellsController from 'src/interface/dungeons&dragons5e/presentation/spells/SpellsController';

describe('Interface :: DungeonsAndDragons5e :: Presentation :: Spells :: SpellsController', () => {
    let spellsController: SpellsController,
        getSpellOperation: any,
        getAllSpellsOperation: any,
        getDisabledSpellsOperation: any,
        getByLevelOperation: any,
        toggleSpellsAvailabilityOperation: any;

    context('#get', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            getSpellOperation = { execute: sinon.spy(() => ({})) };
            getAllSpellsOperation = { execute: () => ({}) };
            getDisabledSpellsOperation = { execute: () => ({}) };
            getByLevelOperation = { execute: () => ({}) };
            toggleSpellsAvailabilityOperation = { execute: () => ({}) };

            spellsController = new SpellsController({
                getSpellOperation,
                getAllSpellsOperation,
                getDisabledSpellsOperation,
                getByLevelOperation,
                toggleSpellsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            await spellsController.get(request, response);

            expect(getSpellOperation.execute).to.have.been.calledWith('123');
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

            getSpellOperation = { execute: () => ({}) };
            getAllSpellsOperation = { execute: sinon.spy(() => ({})) };
            getDisabledSpellsOperation = { execute: () => ({}) };
            getByLevelOperation = { execute: () => ({}) };
            toggleSpellsAvailabilityOperation = { execute: () => ({}) };

            spellsController = new SpellsController({
                getSpellOperation,
                getAllSpellsOperation,
                getDisabledSpellsOperation,
                getByLevelOperation,
                toggleSpellsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await spellsController.getAll(request, response);

            expect(getAllSpellsOperation.execute).to.have.been.called();
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

            getSpellOperation = { execute: () => ({}) };
            getAllSpellsOperation = { execute: () => ({}) };
            getDisabledSpellsOperation = { execute: sinon.spy(() => ({})) };
            getByLevelOperation = { execute: () => ({}) };
            toggleSpellsAvailabilityOperation = { execute: () => ({}) };

            spellsController = new SpellsController({
                getSpellOperation,
                getAllSpellsOperation,
                getDisabledSpellsOperation,
                getByLevelOperation,
                toggleSpellsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await spellsController.getDisabled(request, response);

            expect(getDisabledSpellsOperation.execute).to.have.been.called();
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });

    context('#getByLevel', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            getSpellOperation = { execute: () => ({}) };
            getAllSpellsOperation = { execute: () => ({}) };
            getDisabledSpellsOperation = { execute: () => ({}) };
            getByLevelOperation = { execute: sinon.spy(() => ({})) };
            toggleSpellsAvailabilityOperation = { execute: () => ({}) };

            spellsController = new SpellsController({
                getSpellOperation,
                getAllSpellsOperation,
                getDisabledSpellsOperation,
                getByLevelOperation,
                toggleSpellsAvailabilityOperation,
            });
        });

        it('should correctly call the getByLevel operation', async () => {
            request.query = { queryLevel: '4' };
            await spellsController.getByLevel(request, response);

            expect(getByLevelOperation.execute).to.have.been.calledWith(4);
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

            getSpellOperation = { execute: () => ({}) };
            getAllSpellsOperation = { execute: () => ({}) };
            getDisabledSpellsOperation = { execute: () => ({}) };
            getByLevelOperation = { execute: () => ({}) };
            toggleSpellsAvailabilityOperation = { execute: sinon.spy(() => ({})) };

            spellsController = new SpellsController({
                getSpellOperation,
                getAllSpellsOperation,
                getDisabledSpellsOperation,
                getByLevelOperation,
                toggleSpellsAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { availability: 'false' };
            await spellsController.toggleAvailability(request, response);

            expect(toggleSpellsAvailabilityOperation.execute).to.have.been.calledWith({
                id: '123',
                availability: false,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });
});
