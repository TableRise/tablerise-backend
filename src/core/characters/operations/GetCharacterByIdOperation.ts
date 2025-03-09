import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class GetCharacterByIdOperation {
    private readonly _getCharacterByIdService;
    private readonly _logger;

    constructor({
        getCharacterByIdService,
        logger,
    }: CharacterCoreDependencies['getCharacterByIdOperationContract']) {
        this._getCharacterByIdService = getCharacterByIdService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(characterId: string): Promise<CharacterInstance> {
        this._logger('info', 'Execute - GetCharacterByIdOperation');
        return this._getCharacterByIdService.get(characterId);
    }
}
