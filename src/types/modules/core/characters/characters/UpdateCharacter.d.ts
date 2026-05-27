import UpdateCharacterService from 'src/core/characters/services/UpdateCharacterService';
import SocketIO from 'src/infra/clients/SocketIO';
import CharactersRepository from 'src/infra/repositories/character/CharactersRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateCharacterOperationContract {
    updateCharacterService: UpdateCharacterService;
    socketIO: SocketIO;
    logger: Logger;
}

export interface UpdateCharacterServiceContract {
    charactersRepository: CharactersRepository;
    logger: Logger;
}
