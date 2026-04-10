import RemoveCampaignPlayersService from 'src/core/campaigns/services/campaigns/RemoveCampaignPlayersService';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';

export interface RemoveCampaignPlayersOperationContract {
    removeCampaignPlayersService: RemoveCampaignPlayersService;
    logger: Logger;
}

export interface RemoveCampaignPlayersServiceContract {
    campaignsRepository: CampaignsRepository;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
