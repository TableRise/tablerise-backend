import schemas from 'src/domains/characters/schemas';
import { Logger } from 'src/types/shared/logger';
import GetAllCharactersService from 'src/core/characters/services/CreateCharacterService';
import CharactersRepository from 'src/infra/repositories/character/CharactersRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';

export interface GetAllCharactersOperationContract {
    getAllCharacterService: GetAllCharactersService;
    schemaValidator: SchemaValidator;
    charactersSchema: typeof schemas;
    logger: Logger;
}

export interface GetAllCharactersServiceContract {
    serializer: Serializer;
    charactersRepository: CharactersRepository;
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
