import UpdateMatchCharacterPictureService from 'src/core/campaigns/services/UpdateMatchCharacterPictureService';
import ImageStorageClient from 'src/infra/clients/ImageStorageClient';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateMatchCharacterPictureOperationContract {
    updateMatchCharacterPictureService: UpdateMatchCharacterPictureService;
    logger: Logger;
}

export interface UpdateMatchCharacterPictureServiceContract {
    campaignsRepository: CampaignsRepository;
    imageStorageClient: ImageStorageClient;
    logger: Logger;
}
