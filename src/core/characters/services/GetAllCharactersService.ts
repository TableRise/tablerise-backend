import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class GetAllCharactersService {
    private readonly _charactersRepository;
    private readonly _logger;

    constructor({
        charactersRepository,
        logger,
    }: CharacterCoreDependencies['getAllCharactersServiceContract']) {
        this._charactersRepository = charactersRepository;
        this._logger = logger;
    }

    async getAll(): Promise<CharacterInstance[]> {
        this._logger('info', 'GetAll - GetAllCharactersService');
        return this._charactersRepository.find({});
    }
}
