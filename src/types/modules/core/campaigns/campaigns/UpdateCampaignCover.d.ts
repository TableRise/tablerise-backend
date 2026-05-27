import UpdateCampaignCoverService from 'src/core/campaigns/services/UpdateCampaignCoverService';
import ImageStorageClient from 'src/infra/clients/ImageStorageClient';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateCampaignCoverOperationContract {
    updateCampaignCoverService: UpdateCampaignCoverService;
    logger: Logger;
}

export interface UpdateCampaignCoverServiceContract {
    campaignsRepository: CampaignsRepository;
    imageStorageClient: ImageStorageClient;
    logger: Logger;
}
