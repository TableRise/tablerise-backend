import UpdateCampaignImagesService from 'src/core/campaigns/services/campaigns/UpdateCampaignImagesService';
import ImageStorageClient from 'src/infra/clients/ImageStorageClient';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateCampaignImagesOperationContract {
    updateCampaignImagesService: UpdateCampaignImagesService;
    logger: Logger;
}

export interface UpdateCampaignImagesServiceContract {
    campaignsRepository: CampaignsRepository;
    imageStorageClient: ImageStorageClient;
    logger: Logger;
}
