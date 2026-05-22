import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { GetCampaignByIdPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class GetCampaignByIdService {
    private readonly campaignsRepository;
    private readonly logger;

    constructor({ campaignsRepository, logger }: CampaignCoreDependencies['getCampaignByIdServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    async get({ campaignId }: GetCampaignByIdPayload): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.get.name}`;
        this.logger('info', callName);
        return this.campaignsRepository.findOne({ campaignId });
    }
}
