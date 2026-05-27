import { Logger } from 'src/types/shared/logger';
import AddCampaignNoteService from 'src/core/users/services/users/AddCampaignNoteService';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';

export interface AddCampaignNoteOperationContract {
    addCampaignNoteService: AddCampaignNoteService;
    logger: Logger;
}

export interface AddCampaignNoteServiceContract {
    usersDetailsRepository: UsersDetailsRepository;
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
