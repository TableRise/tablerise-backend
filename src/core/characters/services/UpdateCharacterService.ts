import { CharacterInstance } from "src/domains/characters/schemas/characterPostValidationSchema";
import { updateCharacterPayload } from "src/types/api/characters/http/payload";
import CharacterCoreDependencies from "src/types/modules/core/characters/CharacterCoreDependencies";

export default class UpdateCharacterService {
    private readonly _charactersRepository;
    private readonly _logger;

    constructor({
        charactersRepository,
        logger
    }: CharacterCoreDependencies['updateCharacterServiceContract']) {
        this._charactersRepository = charactersRepository;
        this._logger = logger;

        this.update = this.update.bind(this);
    }

    async update({ characterId, payload }: updateCharacterPayload): Promise<CharacterInstance> {
        this._logger('info', 'UpdateCharacterService - Update');
        return this._charactersRepository.update({
            query: { characterId },
            payload
        });
    }
}
