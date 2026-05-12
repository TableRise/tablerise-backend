import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { UpdateCharacterMoneyPayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class UpdateCharacterMoneyOperation {
    private readonly updateCharacterMoneyService;
    private readonly logger;

    constructor({ updateCharacterMoneyService, logger }: CharacterCoreDependencies['updateCharacterMoneyOperationContract']) {
        this.updateCharacterMoneyService = updateCharacterMoneyService;
        this.logger = logger;
        this.execute = this.execute.bind(this);
    }

    async execute(payload: UpdateCharacterMoneyPayload): Promise<CharactersDnd> {
        this.logger('info', 'UpdateCharacterMoneyOperation - Execute');
        return this.updateCharacterMoneyService.update(payload);
    }
}
