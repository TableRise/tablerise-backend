import { CharacterInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import CharactersDependencies from 'src/types/modules/core/campaigns/CharactersDependencies';

export default class GetAllCharactersOperation {
    private readonly _getAllCharactersService;
    private readonly _logger;

    constructor({
        getAllCharactersService,
        logger,
    }: CharactersDependencies['getAllCharactersOperationContract']) {
        this._getAllCharactersService = getAllCharactersService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(): Promise<CharacterInstance[]> {
        this._logger('info', 'Execute - GetAllCharactersOperation');
        return this._getAllCharactersService.getAll();
    }
}
