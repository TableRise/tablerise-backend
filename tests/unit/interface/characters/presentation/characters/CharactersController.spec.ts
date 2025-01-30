import newUUID from 'src/domains/common/helpers/newUUID';
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import CharactersController from 'src/interface/characters/presentation/character/CharactersController';

describe('Interface :: Characters :: Presentation :: Characters :: CharactersController', () => {
    let charactersController: CharactersController, createCharacterOperation: any;

    context('#create', () => {
        const request = {} as Request;
        const response = {} as Response;
        const userId = newUUID();

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createCharacterOperation = { execute: sinon.spy(() => ({})) };

            charactersController = new CharactersController({
                createCharacterOperation,
            });
        });

        it('should correctly call the methods and functions', async () => {
            request.body = { npc: true };
            request.user = { userId } as Express.User;
            await charactersController.createCharacter(request, response);

            expect(createCharacterOperation.execute).to.have.been.calledWith({
                payload: request.body,
                userId,
            });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
            expect(response.json).to.have.been.called();
        });
    });
});
