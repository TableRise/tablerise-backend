import RemoveCampaignImageService from 'src/core/campaigns/services/RemoveCampaignImageService';
import SocketIO from 'src/infra/clients/SocketIO';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface RemoveCampaignImageOperationContract {
    removeCampaignImageService: RemoveCampaignImageService;
    socketIO: SocketIO;
    logger: Logger;
}

export interface RemoveCampaignImageServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
