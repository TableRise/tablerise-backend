import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { CampaignPayload } from 'src/types/api/campaigns/http/payload';
import { CampaignsControllerContract } from 'src/types/modules/interface/campaigns/presentation/campaigns/CampaignsController.d';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import { FileObject } from 'src/types/shared/file';

export default class CampaignsController {
    private readonly _createCampaignOperation;
    private readonly _getCampaignByIdOperation;

    constructor({
        getCampaignByIdOperation,
        createCampaignOperation,
    }: CampaignsControllerContract) {
        this._createCampaignOperation = createCampaignOperation;
        this._getCampaignByIdOperation = getCampaignByIdOperation;

        this.create = this.create.bind(this);
        this.getById = this.getById.bind(this);
    }

    public async create(req: Request, res: Response): Promise<Response> {
        const campaign = req.body as CampaignPayload;
        const { userId } = req.user as UserInstance;
        const image = req.file as FileObject;
        const result = await this._createCampaignOperation.execute({
            campaign,
            userId,
            image,
        });
        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async getById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this._getCampaignByIdOperation.execute({ campaignId: id });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
