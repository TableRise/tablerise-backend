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

    it('should update a character payload', async () => {
        const request = {
            params: { id: 'character-1' },
            body: { data: { profile: { name: 'Hero' } } },
        } as unknown as Request;
        const response = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        } as unknown as Response;

        await charactersController.updateCharacter(request, response);

        expect(updateCharacterOperation.execute).to.have.been.calledWith({
            characterId: 'character-1',
            payload: request.body,
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
    });

    it('should return all characters', async () => {
        const response = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        } as unknown as Response;

        await charactersController.getAll({} as unknown as Request, response);

        expect(getAllCharactersOperation.execute).to.have.been.called();
        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
    });

    it('should update the character picture', async () => {
        const request = {
            params: { id: 'character-1' },
            file: { originalname: 'picture.png' },
        } as unknown as Request;
        const response = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        } as unknown as Response;

        await charactersController.updateCharacterPicture(request, response);

        expect(updateCharacterPictureOperation.execute).to.have.been.calledWith({
            characterId: 'character-1',
            image: request.file,
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
    });

    it('should add equipment to a character', async () => {
        const request = {
            params: { id: 'character-1' },
            query: { equipmentId: 'equipment-1' },
        } as unknown as Request;
        const response = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        } as unknown as Response;

        await charactersController.addEquipment(request, response);

        expect(addEquipmentOperation.execute).to.have.been.calledWith({
            characterId: 'character-1',
            equipmentId: 'equipment-1',
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
    });

    it('should remove equipment from a character', async () => {
        const request = {
            params: { id: 'character-1' },
            query: { equipmentId: 'equipment-1' },
        } as unknown as Request;
        const response = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        } as unknown as Response;

        await charactersController.removeEquipment(request, response);

        expect(removeEquipmentOperation.execute).to.have.been.calledWith({
            characterId: 'character-1',
            equipmentId: 'equipment-1',
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
    });

    it('should update character money', async () => {
        const request = {
            params: { id: 'character-1' },
            body: { operation: 'add', money: 3, moneyType: 'PL' },
        } as unknown as Request;
        const response = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub().returnsThis(),
        } as unknown as Response;

        await charactersController.updateCharacterMoney(request, response);

        expect(updateCharacterMoneyOperation.execute).to.have.been.calledWith({
            characterId: 'character-1',
            operation: 'add',
            money: 3,
            moneyType: 'PL',
        });
        expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);
    });
});
