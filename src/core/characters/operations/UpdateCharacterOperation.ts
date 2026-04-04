import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { updateCharacterPayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class UpdateCharacterOperation {
    private readonly updateCharacterService;
    private readonly logger;

    constructor({
        updateCharacterService,
        logger,
    }: CharacterCoreDependencies['updateCharacterOperationContract']) {
        this.updateCharacterService = updateCharacterService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute({ characterId, payload }: updateCharacterPayload): Promise<CharactersDnd> {
        this.logger('info', 'UpdateCharacterOperation - Execute');
        return this.updateCharacterService.update({ characterId, payload });
    }
}
