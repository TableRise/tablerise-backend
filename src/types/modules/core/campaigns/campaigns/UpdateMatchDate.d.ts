import updateMatchDateService from 'src/core/campaigns/services/UpdateMatchDateService';
import SocketIO from 'src/infra/clients/SocketIO';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface updateMatchDateOperationContract {
    updateMatchDateService: updateMatchDateService;
    socketIO: SocketIO;
    logger: Logger;
}

export interface updateMatchDateServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
