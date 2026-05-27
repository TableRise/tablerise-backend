import UpdateMatchMusicsService from 'src/core/campaigns/services/UpdateMatchMusicsService';
import SocketIO from 'src/infra/clients/SocketIO';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateMatchMusicsOperationContract {
    updateMatchMusicsService: UpdateMatchMusicsService;
    socketIO: SocketIO;
    logger: Logger;
}

export interface UpdateMatchMusicsServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
