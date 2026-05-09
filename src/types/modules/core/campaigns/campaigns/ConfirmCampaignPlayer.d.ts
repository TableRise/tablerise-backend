import ConfirmCampaignPlayerService from 'src/core/campaigns/services/ConfirmCampaignPlayerService';
import SocketIO from 'src/infra/clients/SocketIO';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface ConfirmCampaignPlayerOperationContract {
    logger: Logger;
    socketIO: SocketIO;
    confirmCampaignPlayerService: ConfirmCampaignPlayerService;
}

export interface ConfirmCampaignPlayerServiceContract {
    logger: Logger;
    campaignsRepository: CampaignsRepository;
}
