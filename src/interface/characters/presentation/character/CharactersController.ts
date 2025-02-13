import { Request, Response } from 'express';
import { CharacterPayload } from 'src/domains/characters/schemas/characterPostValidationSchema';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import { FileObject } from 'src/types/shared/file';

export default class CharactersController {
    private readonly _createCharacterOperation;
    private readonly _recoverCharacterByCampaignOperation;
    private readonly _updateCharacterPictureOperation;

    constructor({
        createCharacterOperation,
        recoverCharacterByCampaignOperation,
        updateCharacterPictureOperation,
    }: InterfaceDependencies['charactersControllerContract']) {
        this._createCharacterOperation = createCharacterOperation;
        this._recoverCharacterByCampaignOperation = recoverCharacterByCampaignOperation;
        this._updateCharacterPictureOperation = updateCharacterPictureOperation;

        this.createCharacter = this.createCharacter.bind(this);
        this.recoverCharactersByCampaign = this.recoverCharactersByCampaign.bind(this);
        this.updateCharacterPicture = this.updateCharacterPicture.bind(this);
    }

    public async createCharacter(req: Request, res: Response): Promise<Response> {
        const payload = req.body as CharacterPayload;
        const { userId } = req.user as Express.User;

        const result = await this._createCharacterOperation.execute({ payload, userId });
        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async recoverCharactersByCampaign(
        req: Request,
        res: Response
    ): Promise<Response> {
        const { id: campaignId } = req.params;
        const { userId } = req.user as Express.User;

        const result = await this._recoverCharacterByCampaignOperation.execute({
            userId,
            campaignId,
        });
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateCharacterPicture(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const result = await this._updateCharacterPictureOperation.execute({
            characterId: id,
            image: req.file as FileObject,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }
}
