import CharactersCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';
import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';

export default class GetAllCharactersService {
    private readonly _charactersRepository;
    private readonly _logger;

    constructor({
        charactersRepository,
        logger,
    }: CharactersCoreDependencies['getAllCharactersServiceContract']) {
        this._charactersRepository = charactersRepository;
        this._logger = logger;
    }

    async getAll(): Promise<CharacterInstance[]> {
        this._logger('info', 'GetAll - GetAllCharactersService');
        const charactersInDb = await this._charactersRepository.find({});
        return charactersInDb;
    }
}
