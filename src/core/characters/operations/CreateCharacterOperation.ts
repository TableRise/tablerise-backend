import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { CreateCharacterPayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class CreateCharacterOperation {
    private readonly createCharacterService;
    private readonly logger;

    constructor({ createCharacterService, logger }: CharacterCoreDependencies['createCharacterOperationContract']) {
        this.createCharacterService = createCharacterService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: CreateCharacterPayload): Promise<CharactersDnd> {
        this.logger('info', 'Execute - CreateCharacterOperation');
        const characterSerialized = this.createCharacterService.serialize(payload);
        const characterEnriched = await this.createCharacterService.enrichment(characterSerialized, payload.userId);
        const characterAutomated = await this.createCharacterService.automation(characterEnriched);

        return this.createCharacterService.save(characterAutomated);
    }
}
