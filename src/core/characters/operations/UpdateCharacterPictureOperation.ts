import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import { UpdateCharacterPicturePayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class UpdateCharacterPictureOperation {
    private readonly updateCharacterPictureService;
    private readonly logger;

    constructor({
        updateCharacterPictureService,
        logger,
    }: CharacterCoreDependencies['updateCharacterPictureOperationContract']) {
        this.updateCharacterPictureService = updateCharacterPictureService;
        this.logger = logger;
    }

    public async execute(payload: UpdateCharacterPicturePayload): Promise<CharacterInstance> {
        this.logger('info', 'Execute - UpdateCharacterPictureOperation');
        return this.updateCharacterPictureService.uploadPicture(payload);
    }
}
