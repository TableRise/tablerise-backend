import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { GetCampaignByIdPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class GetCampaignByIdOperation {
    private readonly getCampaignByIdService;
    private readonly logger;

    constructor({ getCampaignByIdService, logger }: CampaignCoreDependencies['getCampaignByIdOperationContract']) {
        this.getCampaignByIdService = getCampaignByIdService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute({ campaignId }: GetCampaignByIdPayload): Promise<CampaignInstance> {
        this.logger('info', 'Execute - GetCampaignByIdOperation');
        return this.getCampaignByIdService.get({ campaignId });
    }
}
