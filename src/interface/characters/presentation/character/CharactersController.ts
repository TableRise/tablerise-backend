import { Express, Request, Response } from 'express';
import { CharacterPayload } from 'src/domains/characters/schemas/characterPostValidationSchema';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

export default class CharactersController {
    private readonly _createCharacterOperation;

    constructor({
        createCharacterOperation,
    }: InterfaceDependencies['charactersControllerContract']) {
        this._createCharacterOperation = createCharacterOperation;

        this.createCharacter = this.createCharacter.bind(this);
    }

    public async createCharacter(req: Request, res: Response): Promise<Response> {
        const payload = req.body as CharacterPayload;
        const { userId } = req.user as Express.User;

        const result = await this._createCharacterOperation.execute({ payload, userId });
        return res.status(HttpStatusCode.CREATED).json(result);
    }
}
