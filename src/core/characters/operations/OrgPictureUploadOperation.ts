import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import { orgPicturePayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class OrgPictureUploadOperation {
    private readonly _orgPictureUploadService;
    private readonly _logger;

    constructor({
        logger,
        orgPictureUploadService,
    }: CharacterCoreDependencies['orgPictureUploadOperationContract']) {
        this._orgPictureUploadService = orgPictureUploadService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: orgPicturePayload): Promise<CharacterInstance> {
        this._logger('info', 'Execute - OrgPictureUploadOperation');
        return this._orgPictureUploadService.uploadPicture(payload);
    }
}
