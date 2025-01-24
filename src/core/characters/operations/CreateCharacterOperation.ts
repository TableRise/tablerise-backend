import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import { CreateCharacterPayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class CreateCharacterOperation {
    private readonly _schemaValidator;
    private readonly _createCharacterService;
    private readonly _charactersSchema;
    private readonly _logger;

    constructor({
        schemaValidator,
        createCharacterService,
        charactersSchema,
        logger,
    }: CharacterCoreDependencies['createCharacterOperationContract']) {
        this._schemaValidator = schemaValidator;
        this._createCharacterService = createCharacterService;
        this._charactersSchema = charactersSchema;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: CreateCharacterPayload): Promise<CharacterInstance> {
        this._logger('info', 'Execute - CreateCharacterOperation');
        this._schemaValidator.entry(
            this._charactersSchema.characterPostZod,
            payload.payload
        );

        const characterSerialized = this._createCharacterService.serialize(payload);
        const characterEnriched = await this._createCharacterService.enrichment(
            characterSerialized,
            payload.userId
        );

        return this._createCharacterService.save(characterEnriched);
    }
}
