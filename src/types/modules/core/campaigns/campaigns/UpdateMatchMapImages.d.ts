import UpdateMatchMapImagesService from 'src/core/campaigns/services/UpdateMatchMapImagesService';
import ImageStorageClient from 'src/infra/clients/ImageStorageClient';
import SocketIO from 'src/infra/clients/SocketIO';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateMatchMapImagesOperationContract {
    updateMatchMapImagesService: UpdateMatchMapImagesService;
    socketIO: SocketIO;
    logger: Logger;
}

export interface UpdateMatchMapImagesServiceContract {
    campaignsRepository: CampaignsRepository;
    usersDetailsRepository: UsersDetailsRepository;
    imageStorageClient: ImageStorageClient;
    logger: Logger;
}
