import UpdateMatchMapImagesService from 'src/core/campaigns/services/UpdateMatchMapImagesService';
import ImageStorageClient from 'src/infra/clients/ImageStorageClient';
import SocketIO from 'src/infra/clients/SocketIO';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateMatchMapImagesOperationContract {
    updateMatchMapImagesService: UpdateMatchMapImagesService;
    socketIO: SocketIO;
    logger: Logger;
}

export interface UpdateMatchMapImagesServiceContract {
    campaignsRepository: CampaignsRepository;
    imageStorageClient: ImageStorageClient;
    logger: Logger;
}
