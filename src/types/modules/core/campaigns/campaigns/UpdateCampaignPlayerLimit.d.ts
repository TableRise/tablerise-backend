import UpdateCampaignPlayerLimitService from 'src/core/campaigns/services/UpdateCampaignPlayerLimitService';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateCampaignPlayerLimitOperationContract {
    updateCampaignPlayerLimitService: UpdateCampaignPlayerLimitService;
    logger: Logger;
}

export interface UpdateCampaignPlayerLimitServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
