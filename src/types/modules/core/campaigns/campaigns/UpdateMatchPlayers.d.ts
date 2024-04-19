import UpdateMatchPlayersService from 'src/core/campaigns/services/campaigns/UpdateMatchPlayersService';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateMatchPlayersOperationContract {
    updateMatchPlayersService: UpdateMatchPlayersService;
    logger: Logger;
}

export interface UpdateMatchPlayersServiceContract {
    campaignsRepository: CampaignsRepository;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
