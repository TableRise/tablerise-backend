import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import {
    CampaignPayload,
    UpdateMatchMusicsPayload,
    // updateMatchDatePayload,
} from 'src/types/api/campaigns/http/payload';
import { CampaignsControllerContract } from 'src/types/modules/interface/campaigns/presentation/campaigns/CampaignsController.d';
import { FileObject } from 'src/types/shared/file';

export default class CampaignsController {
    private readonly getCampaignsByUserIdOperation;
    private readonly createCampaignOperation;
    private readonly updateCampaignOperation;
    private readonly getCampaignByIdOperation;
    private readonly publishmentOperation;
    private readonly getAllCampaignsOperation;
    private readonly updateMatchMusicsOperation;
    private readonly updateMatchMapImagesOperation;
    private readonly updateMatchDateOperation;
    private readonly addCampaignPlayersOperation;
    private readonly removeCampaignPlayersOperation;
    private readonly addPlayerCharacterOperation;
    private readonly postInvitationEmailOperation;
    private readonly postBanPlayerOperation;
    private readonly updateCampaignImagesOperation;

    constructor({
        getCampaignByIdOperation,
        getCampaignsByUserIdOperation,
        publishmentOperation,
        createCampaignOperation,
        getAllCampaignsOperation,
        updateCampaignOperation,
        updateMatchMapImagesOperation,
        updateMatchMusicsOperation,
        updateMatchDateOperation,
        addCampaignPlayersOperation,
        removeCampaignPlayersOperation,
        addPlayerCharacterOperation,
        postInvitationEmailOperation,
        postBanPlayerOperation,
        updateCampaignImagesOperation,
    }: CampaignsControllerContract) {
        this.getCampaignsByUserIdOperation = getCampaignsByUserIdOperation;
        this.createCampaignOperation = createCampaignOperation;
        this.updateCampaignOperation = updateCampaignOperation;
        this.getCampaignByIdOperation = getCampaignByIdOperation;
        this.publishmentOperation = publishmentOperation;
        this.getAllCampaignsOperation = getAllCampaignsOperation;
        this.updateMatchMapImagesOperation = updateMatchMapImagesOperation;
        this.updateMatchMusicsOperation = updateMatchMusicsOperation;
        this.updateMatchDateOperation = updateMatchDateOperation;
        this.addCampaignPlayersOperation = addCampaignPlayersOperation;
        this.addPlayerCharacterOperation = addPlayerCharacterOperation;
        this.removeCampaignPlayersOperation = removeCampaignPlayersOperation;
        this.postInvitationEmailOperation = postInvitationEmailOperation;
        this.postBanPlayerOperation = postBanPlayerOperation;
        this.updateCampaignImagesOperation = updateCampaignImagesOperation;

        this.getByUserId = this.getByUserId.bind(this);
        this.create = this.create.bind(this);
        this.getById = this.getById.bind(this);
        this.getAll = this.getAll.bind(this);
        this.publishment = this.publishment.bind(this);
        this.update = this.update.bind(this);
        this.updateMatchMapImages = this.updateMatchMapImages.bind(this);
        this.updateMatchMusics = this.updateMatchMusics.bind(this);
        this.updateMatchDate = this.updateMatchDate.bind(this);
        this.addCampaignPlayers = this.addCampaignPlayers.bind(this);
        this.removeCampaignPlayers = this.removeCampaignPlayers.bind(this);
        this.addPlayerCharacter = this.addPlayerCharacter.bind(this);
        this.inviteEmail = this.inviteEmail.bind(this);
        this.updateCampaignImages = this.updateCampaignImages.bind(this);
        this.banPlayer = this.banPlayer.bind(this);
    }

    public async create(req: Request, res: Response): Promise<Response> {
        const campaign = req.body as CampaignPayload;
        const { userId } = req.user as Express.User;
        const files = req.files as Record<string, Express.Multer.File[]>;
        const image = files?.cover?.[0] as FileObject | undefined;
        const mapImages = (files?.mapImages ?? []) as FileObject[];
        const result = await this.createCampaignOperation.execute({
            campaign,
            userId,
            image,
            mapImages,
        });

        delete result.password;

        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        const { title, code } = req.query as { title?: string; code?: string };
        const result = await this.getAllCampaignsOperation.execute({ title, code });
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getCampaignByIdOperation.execute({ campaignId: id });
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getByUserId(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getCampaignsByUserIdOperation.execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async publishment(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.query as { userId: string };
        const payload = req.body;

        const result = await this.publishmentOperation.execute({
            campaignId: id,
            userId,
            payload,
        });
        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async inviteEmail(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { targetEmail } = req.query as { targetEmail: string };

        await this.postInvitationEmailOperation.execute({
            campaignId: id,
            targetEmail,
        });

        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async banPlayer(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { playerId } = req.query as { playerId: string };

        await this.postBanPlayerOperation.execute({
            campaignId: id,
            playerId,
        });

        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async updateMatchMapImages(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { imageId, operation } = req.body as {
            imageId?: string;
            operation: 'add' | 'remove';
        };

        const picture = req.file as FileObject;

        const result = await this.updateMatchMapImagesOperation.execute({
            campaignId: id,
            imageId,
            operation,
            picture,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateMatchMusics(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { operation, title, youtubeLink } = req.body as UpdateMatchMusicsPayload;

        const result = await this.updateMatchMusicsOperation.execute({
            campaignId: id,
            title,
            operation,
            youtubeLink,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateMatchDate(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { operation, date } = req.query as {
            operation: 'add' | 'remove';
            date: string;
        };

        const result = await this.updateMatchDateOperation.execute({
            campaignId: id,
            date,
            operation,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async addCampaignPlayers(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { password } = req.query as {
            password: string;
        };
        const { userId } = req.user as Express.User;

        const result = await this.addCampaignPlayersOperation.execute({
            campaignId: id,
            userId,
            password,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async removeCampaignPlayers(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;

        const result = await this.removeCampaignPlayersOperation.execute({
            campaignId: id,
            userId,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async addPlayerCharacter(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;
        const { characterId } = req.query as {
            characterId: string;
        };

        const result = await this.addPlayerCharacterOperation.execute({
            campaignId: id,
            userId,
            characterId,
        });

        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const payload = req.body;
        const cover = req.file;

        const result = await this.updateCampaignOperation.execute({
            ...payload,
            cover,
            campaignId: id,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateCampaignImages(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { imageId, operation } = req.body as {
            imageId?: string;
            operation: 'add' | 'remove';
        };

        const picture = req.file as FileObject;

        const result = await this.updateCampaignImagesOperation.execute({
            campaignId: id,
            imageId,
            picture: picture as unknown as File,
            operation,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }
}
