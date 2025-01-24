import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import schemas from 'src/domains/characters/schemas';
import { Logger } from 'src/types/shared/logger';
import Serializer from 'src/domains/common/helpers/Serializer';
import CreateCharacterService from 'src/core/character/services/CreateCharacterService';
import CharactersRepository from 'src/infra/repositories/character/CharactersRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';

export interface CreateCharacterOperationContract {
    createCharacterService: CreateCharacterService;
    schemaValidator: SchemaValidator;
    charactersSchema: typeof schemas;
    logger: Logger;
}

export interface CreateCharacterServiceContract {
    serializer: Serializer;
    charactersRepository: CharactersRepository;
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
