import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { GetCampaignByIdPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class GetCampaignByIdService {
    private readonly campaignsRepository;
    private readonly logger;

    constructor({ campaignsRepository, logger }: CampaignCoreDependencies['getCampaignByIdServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    async get({ campaignId }: GetCampaignByIdPayload): Promise<CampaignInstance> {
        this.logger('info', 'Execute - GetCampaignByIdService');
        return this.campaignsRepository.findOne({ campaignId });
    }
}
