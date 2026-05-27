import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import {
    AddMatchDatePayload,
    PostCampaignBuyPayload,
    AddMatchMusicPayload,
    CampaignPayload,
    DeleteCampaignJournalPostPayload,
    EditMatchMusicPayload,
    HighlightedJournalPayload,
    RemoveCampaignPlayerNotePayload,
    RemoveMatchDatePayload,
    RemoveMatchMusicPayload,
    RemoveMatchMapImagePayload,
    UpdateMatchHighlightedImagePayload,
    UpdateCampaignJournalPostPayload,
    UpdateCampaignPlayerNotePayload,
} from 'src/types/api/campaigns/http/payload';
import {
    TDeleteCampaignJournalPostQuery,
    THighlightCampaignMatchImageQuery,
    TPostCampaignBuyBody,
    TUpdateCampaignMatchImagesBody,
    TUpdateCampaignJournalPostBody,
    TUpdateCampaignJournalPostQuery,
    TRemoveCampaignPlayerNoteQuery,
    TUpdateCampaignPlayerNoteBody,
    TUpdateCampaignPlayerNoteQuery,
} from 'src/interface/campaigns/presentation/campaigns/CampaignsSchemas';
import { CampaignsControllerContract } from 'src/types/modules/interface/campaigns/presentation/campaigns/CampaignsController.d';
import { FileObject } from 'src/types/shared/file';

export default class CampaignsController {
    private readonly getCampaignsByUserIdOperation;
    private readonly deleteCampaignOperation;
    private readonly createCampaignOperation;
    private readonly updateCampaignOperation;
    private readonly getCampaignByIdOperation;
    private readonly publishmentOperation;
    private readonly getAllCampaignsOperation;
    private readonly updateMatchMusicsOperation;
    private readonly updateMatchMapImagesOperation;
    private readonly updateMatchImagesOperation;
    private readonly updateMatchHighlightedImageOperation;
    private readonly updateMatchDateOperation;
    private readonly addCampaignPlayersOperation;
    private readonly removeCampaignPlayersOperation;
    private readonly addPlayerCharacterOperation;
    private readonly removePlayerCharacterOperation;
    private readonly getCampaignCharactersOperation;
    private readonly getCharactersByPlayerOperation;
    private readonly postInvitationEmailOperation;
    private readonly postCampaignLogOperation;
    private readonly postCampaignBuyOperation;
    private readonly updateCampaignPlayerLimitOperation;
    private readonly confirmMatchPlayerPresenceOperation;
    private readonly confirmCampaignPlayerOperation;
    private readonly updateCampaignCoverOperation;
    private readonly removeCampaignImageOperation;
    private readonly transferDungeonMasterOperation;
    private readonly updateMatchCharacterPictureOperation;
    private readonly updateCampaignJournalHighlightOperation;
    private readonly updateCampaignJournalPostOperation;
    private readonly deleteCampaignJournalPostOperation;
    private readonly updateCampaignPlayerNoteOperation;
    private readonly removeCampaignPlayerNoteOperation;

    constructor({
        getCampaignByIdOperation,
        getCampaignsByUserIdOperation,
        publishmentOperation,
        createCampaignOperation,
        getAllCampaignsOperation,
        updateCampaignOperation,
        updateMatchMapImagesOperation,
        updateMatchImagesOperation,
        updateMatchHighlightedImageOperation,
        updateMatchMusicsOperation,
        updateMatchDateOperation,
        addCampaignPlayersOperation,
        removeCampaignPlayersOperation,
        addPlayerCharacterOperation,
        removePlayerCharacterOperation,
        getCampaignCharactersOperation,
        getCharactersByPlayerOperation,
        postInvitationEmailOperation,
        postCampaignLogOperation,
        postCampaignBuyOperation,
        updateCampaignPlayerLimitOperation,
        confirmMatchPlayerPresenceOperation,
        confirmCampaignPlayerOperation,
        updateCampaignCoverOperation,
        removeCampaignImageOperation,
        transferDungeonMasterOperation,
        updateMatchCharacterPictureOperation,
        updateCampaignJournalHighlightOperation,
        updateCampaignJournalPostOperation,
        deleteCampaignJournalPostOperation,
        updateCampaignPlayerNoteOperation,
        removeCampaignPlayerNoteOperation,
        deleteCampaignOperation,
    }: CampaignsControllerContract) {
        this.getCampaignsByUserIdOperation = getCampaignsByUserIdOperation;
        this.deleteCampaignOperation = deleteCampaignOperation;
        this.createCampaignOperation = createCampaignOperation;
        this.updateCampaignOperation = updateCampaignOperation;
        this.getCampaignByIdOperation = getCampaignByIdOperation;
        this.publishmentOperation = publishmentOperation;
        this.getAllCampaignsOperation = getAllCampaignsOperation;
        this.updateMatchMapImagesOperation = updateMatchMapImagesOperation;
        this.updateMatchImagesOperation = updateMatchImagesOperation;
        this.updateMatchHighlightedImageOperation = updateMatchHighlightedImageOperation;
        this.updateMatchMusicsOperation = updateMatchMusicsOperation;
        this.updateMatchDateOperation = updateMatchDateOperation;
        this.addCampaignPlayersOperation = addCampaignPlayersOperation;
        this.addPlayerCharacterOperation = addPlayerCharacterOperation;
        this.removePlayerCharacterOperation = removePlayerCharacterOperation;
        this.getCampaignCharactersOperation = getCampaignCharactersOperation;
        this.getCharactersByPlayerOperation = getCharactersByPlayerOperation;
        this.removeCampaignPlayersOperation = removeCampaignPlayersOperation;
        this.postInvitationEmailOperation = postInvitationEmailOperation;
        this.postCampaignLogOperation = postCampaignLogOperation;
        this.postCampaignBuyOperation = postCampaignBuyOperation;
        this.updateCampaignPlayerLimitOperation = updateCampaignPlayerLimitOperation;
        this.confirmMatchPlayerPresenceOperation = confirmMatchPlayerPresenceOperation;
        this.confirmCampaignPlayerOperation = confirmCampaignPlayerOperation;
        this.updateCampaignCoverOperation = updateCampaignCoverOperation;
        this.removeCampaignImageOperation = removeCampaignImageOperation;
        this.transferDungeonMasterOperation = transferDungeonMasterOperation;
        this.updateMatchCharacterPictureOperation = updateMatchCharacterPictureOperation;
        this.updateCampaignJournalHighlightOperation = updateCampaignJournalHighlightOperation;
        this.updateCampaignJournalPostOperation = updateCampaignJournalPostOperation;
        this.deleteCampaignJournalPostOperation = deleteCampaignJournalPostOperation;
        this.updateCampaignPlayerNoteOperation = updateCampaignPlayerNoteOperation;
        this.removeCampaignPlayerNoteOperation = removeCampaignPlayerNoteOperation;

        this.create = this.create.bind(this);
        this.deleteCampaign = this.deleteCampaign.bind(this);
        this.getById = this.getById.bind(this);
        this.getAll = this.getAll.bind(this);
        this.publishment = this.publishment.bind(this);
        this.update = this.update.bind(this);
        this.addMatchMapImages = this.addMatchMapImages.bind(this);
        this.addMatchImages = this.addMatchImages.bind(this);
        this.highlightMatchImage = this.highlightMatchImage.bind(this);
        this.removeMatchMapImage = this.removeMatchMapImage.bind(this);
        this.addMatchMusic = this.addMatchMusic.bind(this);
        this.removeMatchMusic = this.removeMatchMusic.bind(this);
        this.editMatchMusic = this.editMatchMusic.bind(this);
        this.addMatchDate = this.addMatchDate.bind(this);
        this.removeMatchDate = this.removeMatchDate.bind(this);
        this.addCampaignPlayers = this.addCampaignPlayers.bind(this);
        this.removeCampaignPlayers = this.removeCampaignPlayers.bind(this);
        this.addPlayerCharacter = this.addPlayerCharacter.bind(this);
        this.removePlayerCharacter = this.removePlayerCharacter.bind(this);
        this.getCampaignCharacters = this.getCampaignCharacters.bind(this);
        this.getCharactersByPlayer = this.getCharactersByPlayer.bind(this);
        this.getCampaignPlayers = this.getCampaignPlayers.bind(this);
        this.getCampaignJournalPosts = this.getCampaignJournalPosts.bind(this);
        this.getCampaignJournalHighlight = this.getCampaignJournalHighlight.bind(this);
        this.inviteEmail = this.inviteEmail.bind(this);
        this.postCampaignLog = this.postCampaignLog.bind(this);
        this.postCampaignBuy = this.postCampaignBuy.bind(this);
        this.confirmPlayerPresence = this.confirmPlayerPresence.bind(this);
        this.confirmCampaignPlayer = this.confirmCampaignPlayer.bind(this);
        this.updateCampaignCover = this.updateCampaignCover.bind(this);
        this.removeCampaignCover = this.removeCampaignCover.bind(this);
        this.transferDungeonMaster = this.transferDungeonMaster.bind(this);
        this.updateMatchCharacterPicture = this.updateMatchCharacterPicture.bind(this);
        this.updateCampaignJournalHighlight = this.updateCampaignJournalHighlight.bind(this);
        this.updateJournalPost = this.updateJournalPost.bind(this);
        this.deleteJournalPost = this.deleteJournalPost.bind(this);
        this.updatePlayerNote = this.updatePlayerNote.bind(this);
        this.removePlayerNote = this.removePlayerNote.bind(this);
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

    public async deleteCampaign(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;

        const result = await this.deleteCampaignOperation.execute(id, userId);

        return res.status(HttpStatusCode.OK).json(result);
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

    public async postCampaignLog(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;
        const payload = req.body;

        const result = await this.postCampaignLogOperation.execute({
            campaignId: id,
            userId,
            payload,
        });

        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async postCampaignBuy(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;
        const payload = req.body as TPostCampaignBuyBody;

        const result = await this.postCampaignBuyOperation.execute({
            campaignId: id,
            userId,
            payload,
        } as PostCampaignBuyPayload);

        return res.status(HttpStatusCode.CREATED).json(result);
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

    public async addMatchMapImages(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const files = req.files as { mapImages?: Express.Multer.File[] };
        const mapImages = files?.mapImages;

        const result = await this.updateMatchMapImagesOperation.execute({
            campaignId: id,
            mapImages,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async addMatchImages(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const files = req.files as TUpdateCampaignMatchImagesBody;
        const images = files?.images;

        const result = await this.updateMatchImagesOperation.execute({
            campaignId: id,
            images,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async highlightMatchImage(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { imageId, remove } = req.query as unknown as THighlightCampaignMatchImageQuery;

        const result = await this.updateMatchHighlightedImageOperation.execute({
            campaignId: id,
            imageId,
            remove,
        } as UpdateMatchHighlightedImagePayload);

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async removeMatchMapImage(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { imageUrl } = req.query as { imageUrl: string };

        await this.removeCampaignImageOperation.removeMatchMapImage({
            campaignId: id,
            imageUrl,
        } as RemoveMatchMapImagePayload);

        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async addMatchMusic(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { title, id: youtubeId, thumbnail } = req.body as Omit<AddMatchMusicPayload, 'campaignId'>;

        const result = await this.updateMatchMusicsOperation.add({
            campaignId: id,
            title,
            thumbnail,
            id: youtubeId,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async removeMatchMusic(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { id: youtubeId } = req.body as Omit<RemoveMatchMusicPayload, 'campaignId'>;

        const result = await this.updateMatchMusicsOperation.remove({
            campaignId: id,
            id: youtubeId,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async editMatchMusic(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { title, id: youtubeId, thumbnail } = req.body as Omit<EditMatchMusicPayload, 'campaignId'>;

        const result = await this.updateMatchMusicsOperation.edit({
            campaignId: id,
            title,
            thumbnail,
            id: youtubeId,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async addMatchDate(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { date } = req.query as Omit<AddMatchDatePayload, 'campaignId'>;

        const result = await this.updateMatchDateOperation.add({
            campaignId: id,
            date,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async removeMatchDate(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.updateMatchDateOperation.remove({
            campaignId: id,
        } as RemoveMatchDatePayload);

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

    public async getCampaignJournalHighlight(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this.getCampaignByIdOperation.execute({ campaignId: id });

        return res.status(HttpStatusCode.OK).json((result.infos.highlightedJournal ?? {}) as HighlightedJournalPayload);
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

    public async updateCampaignCover(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const picture = req.file as FileObject;

        const result = await this.updateCampaignCoverOperation.execute({
            campaignId: id,
            picture,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async removeCampaignCover(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        await this.removeCampaignImageOperation.removeCover(id);

        return res.status(HttpStatusCode.NO_CONTENT).send();
    }

    public async transferDungeonMaster(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;
        const { userToMaster } = req.query as { userToMaster: string };

        await this.transferDungeonMasterOperation.execute(id, userId, userToMaster);

        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async updateMatchCharacterPicture(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { characterId } = req.query as { characterId: string };
        const picture = req.file as FileObject;

        const result = await this.updateMatchCharacterPictureOperation.execute({
            campaignId: id,
            characterId,
            picture,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateCampaignJournalHighlight(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;

        const result = await this.updateCampaignJournalHighlightOperation.execute({
            campaignId: id,
            userId,
            ...req.body,
        });

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateJournalPost(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId: callerId } = req.user as Express.User;
        const { userId } = req.query as unknown as TUpdateCampaignJournalPostQuery;
        const { postId, title, post, category } = req.body as TUpdateCampaignJournalPostBody;

        const result = await this.updateCampaignJournalPostOperation.execute({
            campaignId: id,
            callerId,
            userId,
            postId,
            title,
            post,
            category,
        } as UpdateCampaignJournalPostPayload);

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async deleteJournalPost(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId: callerId } = req.user as Express.User;
        const { userId, postId } = req.query as unknown as TDeleteCampaignJournalPostQuery;

        await this.deleteCampaignJournalPostOperation.execute({
            campaignId: id,
            callerId,
            userId,
            postId,
        } as DeleteCampaignJournalPostPayload);

        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async updatePlayerNote(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;
        const { title } = req.query as unknown as TUpdateCampaignPlayerNoteQuery;
        const { content } = req.body as TUpdateCampaignPlayerNoteBody;

        const result = await this.updateCampaignPlayerNoteOperation.execute({
            campaignId: id,
            userId,
            title,
            content,
        } as UpdateCampaignPlayerNotePayload);

        return res.status(HttpStatusCode.OK).json(result);
    }

    public async removePlayerNote(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { userId } = req.user as Express.User;
        const { title } = req.query as unknown as TRemoveCampaignPlayerNoteQuery;

        await this.removeCampaignPlayerNoteOperation.execute({
            campaignId: id,
            userId,
            title,
        } as RemoveCampaignPlayerNotePayload);

        return res.status(HttpStatusCode.NO_CONTENT).end();
    }
}
