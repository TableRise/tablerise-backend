import RemoveCampaignImageService from 'src/core/campaigns/services/RemoveCampaignImageService';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface RemoveCampaignImageOperationContract {
    removeCampaignImageService: RemoveCampaignImageService;
    logger: Logger;
}

export interface RemoveCampaignImageServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
