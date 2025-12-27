import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class GetCharacterByIdService {
    private readonly charactersRepository;
    private readonly logger;

    constructor({ charactersRepository, logger }: CharacterCoreDependencies['getCharacterByIdServiceContract']) {
        this.charactersRepository = charactersRepository;
        this.logger = logger;
    }

    async get(characterId: string): Promise<CharacterInstance> {
        this.logger('info', 'Execute - GetCharacterByIdService');
        return this.charactersRepository.findOne({ characterId });
    }
}
