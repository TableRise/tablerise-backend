import UpdateMatchImagesService from 'src/core/campaigns/services/UpdateMatchImagesService';
import ImageStorageClient from 'src/infra/clients/ImageStorageClient';
import SocketIO from 'src/infra/clients/SocketIO';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateMatchImagesOperationContract {
    updateMatchImagesService: UpdateMatchImagesService;
    socketIO: SocketIO;
    logger: Logger;
}

export interface UpdateMatchImagesServiceContract {
    campaignsRepository: CampaignsRepository;
    usersDetailsRepository: UsersDetailsRepository;
    imageStorageClient: ImageStorageClient;
    logger: Logger;
}
