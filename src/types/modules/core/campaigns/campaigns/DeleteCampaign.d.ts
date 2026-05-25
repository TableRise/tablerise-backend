import DeleteCampaignService from 'src/core/campaigns/services/campaigns/DeleteCampaignService';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';

export interface DeleteCampaignOperationContract {
    deleteCampaignService: DeleteCampaignService;
    logger: Logger;
}

export interface DeleteCampaignServiceContract {
    campaignsRepository: CampaignsRepository;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
