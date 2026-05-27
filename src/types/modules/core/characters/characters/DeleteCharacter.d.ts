import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import SocketIO from 'src/infra/clients/SocketIO';
import DeleteCharacterService from 'src/core/characters/services/DeleteCharacterService';
import CharactersRepository from 'src/infra/repositories/character/CharactersRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';

export interface DeleteCharacterOperationContract {
    deleteCharacterService: DeleteCharacterService;
    socketIO: SocketIO;
    logger: Logger;
}

export interface DeleteCharacterServiceContract {
    charactersRepository: CharactersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}
