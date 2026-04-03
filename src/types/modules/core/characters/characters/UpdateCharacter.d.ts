import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import CharactersRepository from 'src/infra/repositories/character/CharactersRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateCharacterOperationContract {
    schemaValidator: SchemaValidator;
    updateCharacterService;
    logger: Logger;
}

export interface UpdateCharacterServiceContract {
    charactersRepository: CharactersRepository;
    logger: Logger;
}
