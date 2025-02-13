import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import { UpdateCharacterPicturePayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class UpdateCharacterPictureOperation {
    private readonly _updateCharacterPictureService;
    private readonly _logger;

    constructor({
        updateCharacterPictureService,
        logger,
    }: CharacterCoreDependencies['updateCharacterPictureOperationContract']) {
        this._updateCharacterPictureService = updateCharacterPictureService;
        this._logger = logger;
    }

    public async execute(
        payload: UpdateCharacterPicturePayload
    ): Promise<CharacterInstance> {
        this._logger('info', 'Execute - UpdateCharacterPictureOperation');
        return this._updateCharacterPictureService.updateCharacterPicture(payload);
    }
}
