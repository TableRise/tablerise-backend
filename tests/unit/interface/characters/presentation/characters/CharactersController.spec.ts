import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import CharactersController from 'src/interface/characters/presentation/character/CharactersController';

describe('Interface :: Characters :: Presentation :: Characters :: CharactersController', () => {
    let charactersController: CharactersController;
    let createCharacterOperation: any;
    let getAllCharactersOperation: any;
    let getCharacterByIdOperation: any;
    let updateCharacterPictureOperation: any;
    let orgPictureUploadOperation: any;
    let updateCharacterOperation: any;
    let addEquipmentOperation: any;
    let removeEquipmentOperation: any;
    let updateCharacterMoneyOperation: any;
    let deleteCharacterOperation: any;

    const buildController = (): CharactersController =>
        new CharactersController({
            createCharacterOperation,
            getAllCharactersOperation,
            getCharacterByIdOperation,
            updateCharacterPictureOperation,
            orgPictureUploadOperation,
            updateCharacterOperation,
            addEquipmentOperation,
            removeEquipmentOperation,
            updateCharacterMoneyOperation,
            deleteCharacterOperation,
        } as any);

    beforeEach(() => {
        createCharacterOperation = { execute: sinon.stub().resolves({}) };
        getAllCharactersOperation = { execute: sinon.stub().resolves([]) };
        getCharacterByIdOperation = { execute: sinon.stub().resolves({}) };
        updateCharacterPictureOperation = { execute: sinon.stub().resolves({}) };
        orgPictureUploadOperation = { execute: sinon.stub().resolves({}) };
        updateCharacterOperation = { execute: sinon.stub().resolves({}) };
        addEquipmentOperation = { execute: sinon.stub().resolves({}) };
        removeEquipmentOperation = { execute: sinon.stub().resolves({}) };
        updateCharacterMoneyOperation = { execute: sinon.stub().resolves({}) };
        deleteCharacterOperation = { execute: sinon.stub().resolves() };

        charactersController = buildController();
    });

    it('should create a character with the authenticated user id', async () => {
        const request = {
            body: { npc: true },
            user: { userId: 'user-1' },
        } as unknown as Request;
        const response = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        } as unknown as Response;

        await charactersController.createCharacter(request, response);

        expect(createCharacterOperation.execute).to.have.been.calledWith({
            payload: request.body,
            userId: 'user-1',
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
        expect(response.json).to.have.been.called();
    });

    it('should fetch a character by id', async () => {
        const request = {
            params: { id: 'character-1' },
        } as unknown as Request;
        const response = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        } as unknown as Response;

        await charactersController.getById(request, response);

        expect(getCharacterByIdOperation.execute).to.have.been.calledWith('character-1');
        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
        expect(response.json).to.have.been.called();
    });

    it('should delete a character with the authenticated user id and return 204', async () => {
        const request = {
            params: { id: 'character-1' },
            user: { userId: 'user-1' },
        } as unknown as Request;
        const response = {
            status: sinon.stub().returnsThis(),
            end: sinon.stub().returnsThis(),
        } as unknown as Response;

        await charactersController.deleteCharacter(request, response);

        expect(deleteCharacterOperation.execute).to.have.been.calledWith({
            characterId: 'character-1',
            userId: 'user-1',
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.NO_CONTENT);
        expect(response.end).to.have.been.called();
    });
});
