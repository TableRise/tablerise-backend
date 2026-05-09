import AddCampaignPlayersService from 'src/core/campaigns/services/campaigns/AddCampaignPlayersService';
import SocketIO from 'src/infra/clients/SocketIO';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';

export interface AddCampaignPlayersOperationContract {
    addCampaignPlayersService: AddCampaignPlayersService;
    socketIO: SocketIO;
    logger: Logger;
}

export interface AddCampaignPlayersServiceContract {
    campaignsRepository: CampaignsRepository;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
