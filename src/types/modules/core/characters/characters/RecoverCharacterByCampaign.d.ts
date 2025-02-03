import { Logger } from 'src/types/shared/logger';
import CharactersRepository from 'src/infra/repositories/character/CharactersRepository';
import RecoverCharacterByCampaignService from 'src/core/characters/services/RecoverCharacterByCampaignService';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';

export interface RecoverCharacterByCampaignOperationContract {
    recoverCharacterByCampaignService: RecoverCharacterByCampaignService;
    logger: Logger;
}

export interface RecoverCharacterByCampaignServiceContract {
    charactersRepository: CharactersRepository;
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
