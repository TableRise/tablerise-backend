import { Logger } from 'src/types/shared/logger';
import AddCampaignNoteService from 'src/core/users/services/users/AddCampaignNoteService';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';

export interface AddCampaignNoteOperationContract {
    addCampaignNoteService: AddCampaignNoteService;
    logger: Logger;
}

export interface AddCampaignNoteServiceContract {
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
