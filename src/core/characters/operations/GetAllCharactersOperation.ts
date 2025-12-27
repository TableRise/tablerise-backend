import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class GetAllCharactersOperation {
    private readonly getAllCharactersService;
    private readonly logger;

    constructor({ getAllCharactersService, logger }: CharacterCoreDependencies['getAllCharactersOperationContract']) {
        this.getAllCharactersService = getAllCharactersService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(): Promise<CharacterInstance[]> {
        this.logger('info', 'Execute - GetAllCharactersOperation');
        return this.getAllCharactersService.getAll();
    }
}
