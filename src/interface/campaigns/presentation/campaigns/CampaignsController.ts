import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { CreateCampaignPayload } from 'src/types/api/campaigns/http/payload';
import { CampaignsControllerContract } from 'src/types/modules/interface/campaigns/presentation/campaigns/CampaignsController.d';

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
        const payload = req.body as CreateCampaignPayload;

        const result = await this._createCampaignOperation.execute(payload);
        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async getById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        const result = await this._getCampaignByIdOperation.execute({ campaignId: id });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
