import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class GetCharacterByIdService {
    private readonly charactersRepository;
    private readonly logger;

    constructor({ charactersRepository, logger }: CharacterCoreDependencies['getCharacterByIdServiceContract']) {
        this.charactersRepository = charactersRepository;
        this.logger = logger;
    }

    async get(characterId: string): Promise<CharactersDnd> {
        const callName = `[${this.constructor.name}] - ${this.get.name}`;
        this.logger('info', callName);
        return this.charactersRepository.findOne({ characterId });
    }
}
