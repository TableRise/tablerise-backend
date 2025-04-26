import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetCampaignByUserIdOperationContract {
    getCampaignsByUserIdService: any;
    logger: Logger;
}

export interface GetCampaignByUserIdServiceContract {
    campaignsRepository: CampaignsRepository;
    usersRepository: UsersDetailsRepository;
    logger: Logger;
}
