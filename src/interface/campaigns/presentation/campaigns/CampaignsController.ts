import { Response, Request } from 'express';
import { CreateCampaignPayload } from 'src/types/api/campaigns/http/payload';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { CampaignsControllerContract } from 'src/types/modules/interface/campaigns/presentation/campaigns/CampaignsController.d';

export default class CampaignsController {
    private readonly _createCampaignOperation;

    constructor({ createCampaignOperation }: CampaignsControllerContract) {
        this._createCampaignOperation = createCampaignOperation;

        this.create = this.create.bind(this);
    }

    public async create(req: Request, res: Response): Promise<Response> {
        const payload = req.body as CreateCampaignPayload;

        const result = await this._createCampaignOperation.execute(payload);
        return res.status(HttpStatusCode.CREATED).json(result);
    }
}
