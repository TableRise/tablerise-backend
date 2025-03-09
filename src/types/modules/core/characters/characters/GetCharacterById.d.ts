import GetCharacterByIdService from 'src/core/characters/services/characters/GetCharacterByIdService';
import CharactersRepository from 'src/infra/repositories/character/CharactersRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetCharacterByIdOperationContract {
    getCharacterByIdService: GetCharacterByIdService;
    logger: Logger;
}

export interface GetCharacterByIdServiceContract {
    charactersRepository: CharactersRepository;
    logger: Logger;
}
