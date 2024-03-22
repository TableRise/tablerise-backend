import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { CreateCampaignPayload } from 'src/types/api/campaigns/http/payload';
import { CampaignsControllerContract } from 'src/types/modules/interface/campaigns/presentation/campaigns/CampaignsController.d';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import { FileObject } from 'src/types/shared/file';

export default class CampaignsController {
    private readonly _createCampaignOperation;
    private readonly _getCampaignByIdOperation;
    private readonly _updateMatchImagesOperation;

    constructor({
        getCampaignByIdOperation,
        createCampaignOperation,
        updateMatchImagesOperation
    }: CampaignsControllerContract) {
        this._createCampaignOperation = createCampaignOperation;
        this._getCampaignByIdOperation = getCampaignByIdOperation;
        this._updateMatchImagesOperation = updateMatchImagesOperation;

        this.create = this.create.bind(this);
        this.getById = this.getById.bind(this);
        this.updateMatchImages = this.updateMatchImages.bind(this);
    }

    public async create(req: Request, res: Response): Promise<Response> {
        const payload = req.body as CreateCampaignPayload;
        const { userId } = req.user as UserInstance;

        const result = await this._createCampaignOperation.execute(payload, userId);
        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async getById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this._getCampaignByIdOperation.execute({ campaignId: id });
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateMatchImages(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { method, operation, musicYoutubeLink } = req.query;

        const mapImage = req.file as FileObject;

        const result = await this._updateMatchImagesOperation.execute({
            campaignId: id,
            method,
            operation,
            assets: {
                musicYoutubeLink,
                mapImage
            }
        });

        return res.status(HttpStatusCode.OK).json(result);
    }
}
