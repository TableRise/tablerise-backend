import PostCampaignLogService from 'src/core/campaigns/services/PostCampaignLogService';
import SocketIO from 'src/infra/clients/SocketIO';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface PostCampaignLogOperationContract {
    postCampaignLogService: PostCampaignLogService;
    socketIO: SocketIO;
    logger: Logger;
}

export interface PostCampaignLogServiceContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
