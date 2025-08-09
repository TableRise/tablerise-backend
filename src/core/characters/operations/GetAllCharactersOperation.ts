import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class GetAllCharactersOperation {
    private readonly _getAllCharactersService;
    private readonly _logger;

    constructor({ getAllCharactersService, logger }: CharacterCoreDependencies['getAllCharactersOperationContract']) {
        this._getAllCharactersService = getAllCharactersService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(): Promise<CharacterInstance[]> {
        this._logger('info', 'Execute - GetAllCharactersOperation');
        return this._getAllCharactersService.getAll();
    }
}
