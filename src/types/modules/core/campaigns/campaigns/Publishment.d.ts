import PublishmentService from 'src/core/campaigns/services/PublishmentService';
import SocketIO from 'src/infra/clients/SocketIO';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';

export interface PublishmentOperationContract {
    publishmentService: PublishmentService;
    socketIO: SocketIO;
    logger: Logger;
}

export interface PublishmentServiceContract {
    campaignsRepository: CampaignsRepository;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
