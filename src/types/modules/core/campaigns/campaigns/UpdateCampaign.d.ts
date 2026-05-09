import UpdateCampaignService from 'src/core/campaigns/services/UpdateCampaignService';
import SocketIO from 'src/infra/clients/SocketIO';
import { Logger } from 'src/types/shared/logger';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';

export interface UpdateCampaignOperationContract {
    updateCampaignService: UpdateCampaignService;
    socketIO: SocketIO;
    logger: Logger;
}

export interface UpdateCampaignServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
