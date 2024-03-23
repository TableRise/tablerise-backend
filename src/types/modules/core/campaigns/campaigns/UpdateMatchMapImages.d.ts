import ImageStorageClient from 'src/infra/clients/ImageStorageClient';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateMatchMapImagesOperationContract {
    logger: Logger;
}

export interface UpdateMatchMapImagesServiceContract {
    campaignsRepository: CampaignsRepository;
    imageStorageClient: ImageStorageClient;
    logger: Logger;
}
