import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { GetCampaignByIdPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class GetCampaignByIdOperation {
    private readonly _getCampaignByIdService;
    private readonly _logger;

    constructor({
        getCampaignByIdService,
        logger,
    }: CampaignCoreDependencies['getCampaignByIdOperationContract']) {
        this._getCampaignByIdService = getCampaignByIdService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute({ campaignId }: GetCampaignByIdPayload): Promise<CampaignInstance> {
        this._logger('info', 'Execute - GetCampaignByIdOperation');
        return this._getCampaignByIdService.get({ campaignId });
    }
}
