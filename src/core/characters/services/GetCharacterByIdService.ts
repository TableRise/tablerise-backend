import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class GetCharacterByIdService {
    private readonly _charactersRepository;
    private readonly _logger;

    constructor({
        charactersRepository,
        logger,
    }: CharacterCoreDependencies['getCharacterByIdServiceContract']) {
        this._charactersRepository = charactersRepository;
        this._logger = logger;
    }

    async get(characterId: string): Promise<CharacterInstance> {
        this._logger('info', 'Execute - GetCharacterByIdService');
        return this._charactersRepository.findOne({ characterId });
    }
}
