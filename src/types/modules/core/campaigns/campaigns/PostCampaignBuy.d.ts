import PostCampaignBuyService from 'src/core/campaigns/services/PostCampaignBuyService';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface PostCampaignBuyOperationContract {
    postCampaignBuyService: PostCampaignBuyService;
    logger: Logger;
}

export interface PostCampaignBuyServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
