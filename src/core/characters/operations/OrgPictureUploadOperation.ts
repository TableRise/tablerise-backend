import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { orgPicturePayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class OrgPictureUploadOperation {
    private readonly orgPictureUploadService;
    private readonly logger;

    constructor({ logger, orgPictureUploadService }: CharacterCoreDependencies['orgPictureUploadOperationContract']) {
        this.orgPictureUploadService = orgPictureUploadService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: orgPicturePayload): Promise<CharactersDnd> {
        this.logger('info', 'Execute - OrgPictureUploadOperation');
        return this.orgPictureUploadService.uploadPicture(payload);
    }
}
