import GetCharactersByPlayerService from 'src/core/campaigns/services/GetCharactersByPlayerService';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import CharactersRepository from 'src/infra/repositories/character/CharactersRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetCharactersByPlayerOperationContract {
    logger: Logger;
    getCharactersByPlayerService: GetCharactersByPlayerService;
}

export interface GetCharactersByPlayerServiceContract {
    logger: Logger;
    campaignsRepository: CampaignsRepository;
    charactersRepository: CharactersRepository;
}
