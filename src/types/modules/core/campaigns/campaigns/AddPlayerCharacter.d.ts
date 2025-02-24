import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface AddPlayerCharacterOperationContract {
    logger: Logger;
    addPlayerCharacterService: any;
}


export interface AddPlayerCharacterServiceContract {
    logger: Logger;
    campaignsRepository: CampaignsRepository;
}
