import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
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

    public async execute(payload: UpdateCharacterPicturePayload): Promise<CharactersDnd> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        return this.updateCharacterPictureService.uploadPicture(payload);
    }
}
