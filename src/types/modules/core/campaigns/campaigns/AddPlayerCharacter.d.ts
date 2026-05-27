import AddPlayerCharacterService from 'src/core/campaigns/services/AddPlayerCharacterService';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import CharactersRepository from 'src/infra/repositories/character/CharactersRepository';
import { Logger } from 'src/types/shared/logger';

export interface AddPlayerCharacterOperationContract {
    logger: Logger;
    addPlayerCharacterService: AddPlayerCharacterService;
}

export interface AddPlayerCharacterServiceContract {
    logger: Logger;
    campaignsRepository: CampaignsRepository;
    charactersRepository: CharactersRepository;
}
