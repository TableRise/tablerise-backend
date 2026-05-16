import DeleteCampaignService from 'src/core/campaigns/services/campaigns/DeleteCampaignService';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import CharactersRepository from 'src/infra/repositories/character/CharactersRepository';
import { Logger } from 'src/types/shared/logger';

export interface DeleteCampaignOperationContract {
    deleteCampaignService: DeleteCampaignService;
    logger: Logger;
}

export interface DeleteCampaignServiceContract {
    campaignsRepository: CampaignsRepository;
    usersDetailsRepository: UsersDetailsRepository;
    charactersRepository: CharactersRepository;
    logger: Logger;
}
