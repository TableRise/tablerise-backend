import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import MonstersController from 'src/interface/dungeons&dragons5e/presentation/monsters/MonstersController';

describe('Interface :: DungeonsAndDragons5e :: Presentation :: Monsters :: MonstersController', () => {
    let monstersController: MonstersController,
        getMonsterOperation: any,
        getAllMonstersOperation: any,
        getDisabledMonstersOperation: any,
        toggleMonstersAvailabilityOperation: any;

    context('#get', () => {
        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            getMonsterOperation = { execute: sinon.spy(() => ({})) };
            getAllMonstersOperation = { execute: () => ({}) };
            getDisabledMonstersOperation = { execute: () => ({}) };
            toggleMonstersAvailabilityOperation = { execute: () => ({}) };

            monstersController = new MonstersController({
                getMonsterOperation,
                getAllMonstersOperation,
                getDisabledMonstersOperation,
                toggleMonstersAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            await monstersController.get(request, response);

            expect(getMonsterOperation.execute).to.have.been.calledWith('123');
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

            getMonsterOperation = { execute: () => ({}) };
            getAllMonstersOperation = { execute: sinon.spy(() => ({})) };
            getDisabledMonstersOperation = { execute: () => ({}) };
            toggleMonstersAvailabilityOperation = { execute: () => ({}) };

            monstersController = new MonstersController({
                getMonsterOperation,
                getAllMonstersOperation,
                getDisabledMonstersOperation,
                toggleMonstersAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await monstersController.getAll(request, response);

            expect(getAllMonstersOperation.execute).to.have.been.called();
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

            getMonsterOperation = { execute: () => ({}) };
            getAllMonstersOperation = { execute: () => ({}) };
            getDisabledMonstersOperation = { execute: sinon.spy(() => ({})) };
            toggleMonstersAvailabilityOperation = { execute: () => ({}) };

            monstersController = new MonstersController({
                getMonsterOperation,
                getAllMonstersOperation,
                getDisabledMonstersOperation,
                toggleMonstersAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            await monstersController.getDisabled(request, response);

            expect(getDisabledMonstersOperation.execute).to.have.been.called();
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

            getMonsterOperation = { execute: () => ({}) };
            getAllMonstersOperation = { execute: () => ({}) };
            getDisabledMonstersOperation = { execute: () => ({}) };
            toggleMonstersAvailabilityOperation = { execute: sinon.spy(() => ({})) };

            monstersController = new MonstersController({
                getMonsterOperation,
                getAllMonstersOperation,
                getDisabledMonstersOperation,
                toggleMonstersAvailabilityOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.params = { id: '123' };
            request.query = { availability: 'false' };
            await monstersController.toggleAvailability(request, response);

            expect(toggleMonstersAvailabilityOperation.execute).to.have.been.calledWith({
                id: '123',
                availability: false,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
            expect(response.json).to.have.been.called();
        });
    });
});
