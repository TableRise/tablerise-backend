import PublishmentService from 'src/core/campaigns/services/PublishmentService';
import SocketIO from 'src/infra/clients/SocketIO';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface PublishmentOperationContract {
    publishmentService: PublishmentService;
    socketIO: SocketIO;
    logger: Logger;
}

export interface PublishmentServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
