import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import CharactersRepository from 'src/infra/repositories/character/CharactersRepository';
import { Logger } from 'src/types/shared/logger';

export interface RemovePlayerCharacterOperationContract {
    logger: Logger;
    removePlayerCharacterService: any;
}

export interface RemovePlayerCharacterServiceContract {
    logger: Logger;
    campaignsRepository: CampaignsRepository;
    charactersRepository: CharactersRepository;
}
