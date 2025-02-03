import CharactersDependencies from 'src/types/modules/core/characters/CharactersDependencies';

export default class GetAllCharactersService {
    private readonly _charactersRepository;
    private readonly _logger;

    constructor({
        charactersRepository,
        logger,
    }: CharactersDependencies['getAllCharactersServiceContract']) {
        this._charactersRepository = charactersRepository;
        this._logger = logger;
    }

    async getAll(): Promise<CharacterInstance[]> {
        this._logger('info', 'GetAll - GetAllCharactersService');
        const charactersInDb = await this._charactersRepository.find({});
        return charactersInDb;

    }
}
