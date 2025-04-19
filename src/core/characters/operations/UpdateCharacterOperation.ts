import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import { updateCharacterPayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class UpdateCharacterOperation {
    private readonly _schemaValidator;
    private readonly _charactersSchema;
    private readonly _updateCharacterService;
    private readonly _logger;

    constructor({
        schemaValidator,
        updateCharacterService,
        charactersSchema,
        logger
    }: CharacterCoreDependencies['updateCharacterOperationContract']) {
        this._updateCharacterService = updateCharacterService;
        this._schemaValidator = schemaValidator;
        this._charactersSchema = charactersSchema;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute({ characterId, payload }: updateCharacterPayload): Promise<CharacterInstance> {
        this._logger('info', 'UpdateCharacterOperation - Execute');
        this._schemaValidator.entry(this._charactersSchema.characterPutZod, payload);

        return this._updateCharacterService.update({ characterId, payload });
    }
}
