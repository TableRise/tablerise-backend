import UpdateMatchImagesService from 'src/core/campaigns/services/UpdateMatchImagesService';
import ImageStorageClient from 'src/infra/clients/ImageStorageClient';
import SocketIO from 'src/infra/clients/SocketIO';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateMatchImagesOperationContract {
    updateMatchImagesService: UpdateMatchImagesService;
    socketIO: SocketIO;
    logger: Logger;
}

export interface UpdateMatchImagesServiceContract {
    campaignsRepository: CampaignsRepository;
    imageStorageClient: ImageStorageClient;
    logger: Logger;
}
