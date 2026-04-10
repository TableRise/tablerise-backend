import UpdateCampaignService from 'src/core/campaigns/services/campaigns/UpdateCampaignService';
import ImageStorageClient from 'src/infra/clients/ImageStorageClient';
import { Logger } from 'src/types/shared/logger';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';

export interface UpdateCampaignOperationContract {
    updateCampaignService: UpdateCampaignService;
    logger: Logger;
}

export interface UpdateCampaignServiceContract {
    campaignsRepository: CampaignsRepository;
    imageStorageClient: ImageStorageClient;
    logger: Logger;
}
