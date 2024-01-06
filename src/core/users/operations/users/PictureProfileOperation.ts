import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import { UserImagePayload } from 'src/types/api/users/http/payload';

export default class PictureProfileOperation {
    private readonly _pictureProfileService;
    private readonly _logger;

    constructor({
        logger,
        pictureProfileService,
    }: UserCoreDependencies['pictureProfileOperationContract']) {
        this._pictureProfileService = pictureProfileService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ userId, image }: UserImagePayload): Promise<UserInstance> {
        this._logger('info', 'Execute - PictureProfileOperation');
        return this._pictureProfileService.uploadPicture({ userId, image });
    }
}
