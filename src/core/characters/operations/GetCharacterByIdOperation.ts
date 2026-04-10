import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class GetCharacterByIdOperation {
    private readonly getCharacterByIdService;
    private readonly logger;

    constructor({ getCharacterByIdService, logger }: CharacterCoreDependencies['getCharacterByIdOperationContract']) {
        this.getCharacterByIdService = getCharacterByIdService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(characterId: string): Promise<CharactersDnd> {
        this.logger('info', 'Execute - GetCharacterByIdOperation');
        return this.getCharacterByIdService.get(characterId);
    }
}
