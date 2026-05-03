import CharactersRepository from 'src/infra/repositories/character/CharactersRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetCampaignCharactersOperationContract {
    logger: Logger;
    getCampaignCharactersService: any;
}

export interface GetCampaignCharactersServiceContract {
    logger: Logger;
    charactersRepository: CharactersRepository;
}
