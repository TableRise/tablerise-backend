import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import CharactersRepository from 'src/infra/repositories/character/CharactersRepository';
import schemas from 'src/domains/characters/schemas';
import { Logger } from 'src/types/shared/logger';

export interface UpdateCharacterOperationContract {
    schemaValidator: SchemaValidator;
    charactersSchema: typeof schemas;
    updateCharacterService;
    logger: Logger;
}

export interface UpdateCharacterServiceContract {
    charactersRepository: CharactersRepository;
    logger: Logger;
}
