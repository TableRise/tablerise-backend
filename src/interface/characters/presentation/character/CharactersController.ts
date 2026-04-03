import { Request, Response } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import { FileObject } from 'src/types/shared/file';
import { TCreateCharacterBody } from './CharactersSchemas';

export default class CharactersController {
    private readonly createCharacterOperation;
    private readonly getAllCharactersOperation;
    private readonly getCharacterByIdOperation;
    private readonly updateCharacterOperation;
    private readonly recoverCharacterByCampaignOperation;
    private readonly updateCharacterPictureOperation;
    private readonly orgPictureUploadOperation;

    constructor({
        createCharacterOperation,
        getAllCharactersOperation,
        getCharacterByIdOperation,
        recoverCharacterByCampaignOperation,
        orgPictureUploadOperation,
        updateCharacterOperation,
        updateCharacterPictureOperation,
    }: InterfaceDependencies['charactersControllerContract']) {
        this.createCharacterOperation = createCharacterOperation;
        this.recoverCharacterByCampaignOperation = recoverCharacterByCampaignOperation;
        this.getAllCharactersOperation = getAllCharactersOperation;
        this.getCharacterByIdOperation = getCharacterByIdOperation;
        this.orgPictureUploadOperation = orgPictureUploadOperation;
        this.updateCharacterPictureOperation = updateCharacterPictureOperation;
        this.updateCharacterOperation = updateCharacterOperation;

        this.createCharacter = this.createCharacter.bind(this);
        this.getById = this.getById.bind(this);
        this.getAll = this.getAll.bind(this);
        this.recoverCharactersByCampaign = this.recoverCharactersByCampaign.bind(this);
        this.updateCharacterPicture = this.updateCharacterPicture.bind(this);
        this.updateCharacter = this.updateCharacter.bind(this);
        this.organizationPicture = this.organizationPicture.bind(this);
    }

    public async createCharacter(req: Request, res: Response): Promise<Response> {
        const payload = req.body as TCreateCharacterBody;
        const { userId } = req.user as Express.User;

        const result = await this.createCharacterOperation.execute({ payload, userId });
        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async getById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getCharacterByIdOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async organizationPicture(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { orgName } = req.query as { orgName: string };

        const result = await this.orgPictureUploadOperation.execute({
            orgName,
            characterId: id,
            image: req.file as FileObject,
        });

        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async updateCharacter(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const payload = req.body;

        const result = await this.updateCharacterOperation.execute({
            characterId: id,
            payload,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const result = await this.getAllCharactersOperation.execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async recoverCharactersByCampaign(req: Request, res: Response): Promise<Response> {
        const { id: campaignId } = req.params;
        const { userId } = req.user as Express.User;

        const result = await this.recoverCharacterByCampaignOperation.execute({
            userId,
            campaignId,
        });
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateCharacterPicture(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const result = await this.updateCharacterPictureOperation.execute({
            characterId: id,
            image: req.file as FileObject,
        });

        return res.status(HttpStatusCode.CREATED).json(result);
    }
}
