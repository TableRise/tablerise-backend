import UpdateMatchMapImagesService from 'src/core/campaigns/services/campaigns/UpdateMatchMapImagesService';
import ImageStorageClient from 'src/infra/clients/ImageStorageClient';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateMatchMapImagesOperationContract {
    updateMatchMapImagesService: UpdateMatchMapImagesService;
    logger: Logger;
}

export interface UpdateMatchMapImagesServiceContract {
    campaignsRepository: CampaignsRepository;
    imageStorageClient: ImageStorageClient;
    logger: Logger;
}
