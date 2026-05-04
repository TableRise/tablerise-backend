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
    private readonly removePlayerCharacterOperation;
    private readonly getCampaignCharactersOperation;
    private readonly getCharactersByPlayerOperation;
    private readonly postInvitationEmailOperation;
    private readonly postBanPlayerOperation;
    private readonly updateCampaignImagesOperation;
    private readonly updateCampaignPlayerLimitOperation;
    private readonly confirmMatchPlayerPresenceOperation;
    private readonly confirmCampaignPlayerOperation;
    private readonly updateCampaignCoverOperation;
    private readonly removeCampaignImageOperation;
    private readonly transferDungeonMasterOperation;

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
        removePlayerCharacterOperation,
        getCampaignCharactersOperation,
        getCharactersByPlayerOperation,
        postInvitationEmailOperation,
        postBanPlayerOperation,
        updateCampaignImagesOperation,
        updateCampaignPlayerLimitOperation,
        confirmMatchPlayerPresenceOperation,
        confirmCampaignPlayerOperation,
        updateCampaignCoverOperation,
        removeCampaignImageOperation,
        transferDungeonMasterOperation,
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
        this.removePlayerCharacterOperation = removePlayerCharacterOperation;
        this.getCampaignCharactersOperation = getCampaignCharactersOperation;
        this.getCharactersByPlayerOperation = getCharactersByPlayerOperation;
        this.removeCampaignPlayersOperation = removeCampaignPlayersOperation;
        this.postInvitationEmailOperation = postInvitationEmailOperation;
        this.postBanPlayerOperation = postBanPlayerOperation;
        this.updateCampaignImagesOperation = updateCampaignImagesOperation;
        this.updateCampaignPlayerLimitOperation = updateCampaignPlayerLimitOperation;
        this.confirmMatchPlayerPresenceOperation = confirmMatchPlayerPresenceOperation;
        this.confirmCampaignPlayerOperation = confirmCampaignPlayerOperation;
        this.updateCampaignCoverOperation = updateCampaignCoverOperation;
        this.removeCampaignImageOperation = removeCampaignImageOperation;
        this.transferDungeonMasterOperation = transferDungeonMasterOperation;

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
        this.removePlayerCharacter = this.removePlayerCharacter.bind(this);
        this.getCampaignCharacters = this.getCampaignCharacters.bind(this);
        this.getCharactersByPlayer = this.getCharactersByPlayer.bind(this);
        this.getCampaignPlayers = this.getCampaignPlayers.bind(this);
        this.getCampaignJournalPosts = this.getCampaignJournalPosts.bind(this);
        this.inviteEmail = this.inviteEmail.bind(this);
        this.updateCampaignImages = this.updateCampaignImages.bind(this);
        this.banPlayer = this.banPlayer.bind(this);
        this.confirmPlayerPresence = this.confirmPlayerPresence.bind(this);
        this.confirmCampaignPlayer = this.confirmCampaignPlayer.bind(this);
        this.updateCampaignCover = this.updateCampaignCover.bind(this);
        this.removeCampaignImage = this.removeCampaignImage.bind(this);
        this.transferDungeonMaster = this.transferDungeonMaster.bind(this);
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

    public async publishment(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as { userId: string };
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

    public async updateCampaignPlayerLimit(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { newLimit } = req.query;

        await this.updateCampaignPlayerLimitOperation.execute(id, Number(newLimit));

        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async confirmPlayerPresence(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;
        const { cancel } = req.query as unknown as { cancel: boolean };

        await this.confirmMatchPlayerPresenceOperation.execute(id, userId, cancel);

        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async confirmCampaignPlayer(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;
        const { userToActivate } = req.query as { userToActivate: string };

        await this.confirmCampaignPlayerOperation.execute(id, userId, userToActivate);

        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async updateMatchMapImages(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const files = req.files as { mapImages?: Express.Multer.File[] };
        const mapImages = files?.mapImages;

        const result = await this.updateMatchMapImagesOperation.execute({
            campaignId: id,
            mapImages,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateMatchMusics(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { operation, title, id: youtubeId, thumbnail } = req.body as UpdateMatchMusicsPayload;

        const result = await this.updateMatchMusicsOperation.execute({
            campaignId: id,
            title,
            operation,
            thumbnail,
            id: youtubeId,
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
        const { password, userToAdd } = req.query as {
            password: string;
            userToAdd?: string;
        };
        const { userId: callerId } = req.user as Express.User;
        const userId = userToAdd ?? callerId;

        const result = await this.addCampaignPlayersOperation.execute({
            campaignId: id,
            userId,
            password,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async removeCampaignPlayers(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userToRemove } = req.query as { userToRemove?: string };
        const { userId: callerId } = req.user as Express.User;
        const userId = userToRemove ?? callerId;

        const result = await this.removeCampaignPlayersOperation.execute({
            campaignId: id,
            userId,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async addPlayerCharacter(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { characterId } = req.query as {
            characterId: string;
        };

        const result = await this.addPlayerCharacterOperation.execute({
            campaignId: id,
            characterId,
        });

        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async removePlayerCharacter(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { characterId } = req.query as {
            characterId: string;
        };

        const result = await this.removePlayerCharacterOperation.execute({
            campaignId: id,
            characterId,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getCampaignCharacters(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getCampaignCharactersOperation.execute(id);

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getCharactersByPlayer(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;

        const result = await this.getCharactersByPlayerOperation.execute(id, userId);

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getCampaignPlayers(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getCampaignByIdOperation.execute({ campaignId: id });

        return res.status(HttpStatusCode.OK).json(result.campaignPlayers);
    }

    public async getCampaignJournalPosts(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getCampaignByIdOperation.execute({ campaignId: id });

        return res.status(HttpStatusCode.OK).json(result.infos.journal);
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const payload = req.body;

        const result = await this.updateCampaignOperation.execute({
            ...payload,
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

    public async updateCampaignCover(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const picture = req.file as FileObject;

        const result = await this.updateCampaignCoverOperation.execute({
            campaignId: id,
            picture,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async removeCampaignImage(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { imageUrl, type } = req.query as { imageUrl: string; type: 'cover' | 'mapImages' };

        await this.removeCampaignImageOperation.execute({
            campaignId: id,
            imageUrl,
            type,
        });

        return res.status(HttpStatusCode.NO_CONTENT).send();
    }

    public async transferDungeonMaster(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;
        const { userToMaster } = req.query as { userToMaster: string };

        await this.transferDungeonMasterOperation.execute(id, userId, userToMaster);

        return res.status(HttpStatusCode.NO_CONTENT).end();
    }
}
