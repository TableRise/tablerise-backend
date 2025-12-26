import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import { UserImagePayload } from 'src/types/api/users/http/payload';

export default class PictureProfileOperation {
    private readonly _pictureProfileService;
    private readonly _logger;

    constructor({ logger, pictureProfileService }: UserCoreDependencies['pictureProfileOperationContract']) {
        this._pictureProfileService = pictureProfileService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ userId, image }: UserImagePayload): Promise<User> {
        this._logger('info', 'Execute - PictureProfileOperation');
        return this._pictureProfileService.uploadPicture({ userId, image });
    }
}
