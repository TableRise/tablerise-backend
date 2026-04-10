import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import { UserImagePayload } from 'src/types/api/users/http/payload';

export default class PictureProfileOperation {
    private readonly pictureProfileService;
    private readonly logger;

    constructor({ logger, pictureProfileService }: UserCoreDependencies['pictureProfileOperationContract']) {
        this.pictureProfileService = pictureProfileService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ userId, image }: UserImagePayload): Promise<User> {
        this.logger('info', 'Execute - PictureProfileOperation');
        return this.pictureProfileService.uploadPicture({ userId, image });
    }
}
