import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import { updateCharacterPayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class UpdateCharacterOperation {
    private readonly schemaValidator;
    private readonly charactersSchema;
    private readonly updateCharacterService;
    private readonly logger;

    constructor({
        schemaValidator,
        updateCharacterService,
        charactersSchema,
        logger,
    }: CharacterCoreDependencies['updateCharacterOperationContract']) {
        this.updateCharacterService = updateCharacterService;
        this.schemaValidator = schemaValidator;
        this.charactersSchema = charactersSchema;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute({ characterId, payload }: updateCharacterPayload): Promise<CharacterInstance> {
        this.logger('info', 'UpdateCharacterOperation - Execute');
        return this.updateCharacterService.update({ characterId, payload });
    }
}
