import CharactersRepository from 'src/infra/repositories/character/CharactersRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateCharacterOperationContract {
    updateCharacterService;
    logger: Logger;
}

export interface UpdateCharacterServiceContract {
    charactersRepository: CharactersRepository;
    logger: Logger;
}
