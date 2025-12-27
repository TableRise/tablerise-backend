import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class GetAllCharactersService {
    private readonly charactersRepository;
    private readonly logger;

    constructor({ charactersRepository, logger }: CharacterCoreDependencies['getAllCharactersServiceContract']) {
        this.charactersRepository = charactersRepository;
        this.logger = logger;
    }

    async getAll(): Promise<CharacterInstance[]> {
        this.logger('info', 'GetAll - GetAllCharactersService');
        return this.charactersRepository.find({});
    }
}
