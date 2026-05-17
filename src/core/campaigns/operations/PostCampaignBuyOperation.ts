import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { PostCampaignBuyPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class PostCampaignBuyOperation {
    private readonly postCampaignBuyService;
    private readonly logger;

    constructor({ postCampaignBuyService, logger }: CampaignCoreDependencies['postCampaignBuyOperationContract']) {
        this.postCampaignBuyService = postCampaignBuyService;
        this.logger = logger;
    }

    public async execute(payload: PostCampaignBuyPayload): Promise<Campaign> {
        this.logger('info', 'Execute - PostCampaignBuyOperation');
        return await this.postCampaignBuyService.createBuy(payload);
    }
}
