import UpdateCampaignService from 'src/core/campaigns/services/UpdateCampaignService';
import SocketIO from 'src/infra/clients/SocketIO';
import { Logger } from 'src/types/shared/logger';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';

export interface UpdateCampaignOperationContract {
    updateCampaignService: UpdateCampaignService;
    socketIO: SocketIO;
    logger: Logger;
}

export interface UpdateCampaignServiceContract {
    campaignsRepository: CampaignsRepository;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
