import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import { CreateCharacterPayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class CreateCharacterOperation {
    private readonly schemaValidator;
    private readonly createCharacterService;
    private readonly charactersSchema;
    private readonly logger;

    constructor({
        schemaValidator,
        createCharacterService,
        charactersSchema,
        logger,
    }: CharacterCoreDependencies['createCharacterOperationContract']) {
        this.schemaValidator = schemaValidator;
        this.createCharacterService = createCharacterService;
        this.charactersSchema = charactersSchema;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: CreateCharacterPayload): Promise<CharacterInstance> {
        this.logger('info', 'Execute - CreateCharacterOperation');
        const characterSerialized = this.createCharacterService.serialize(payload);
        const characterEnriched = await this.createCharacterService.enrichment(characterSerialized, payload.userId);
        const characterAutomated = await this.createCharacterService.automation(characterEnriched);

        return this.createCharacterService.save(characterAutomated);
    }
}
