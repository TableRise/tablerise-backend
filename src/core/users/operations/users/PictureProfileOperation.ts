import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import { PictureProfileOperationContract } from 'src/types/users/contracts/core/PictureProfile';
import { UserImagePayload } from 'src/types/users/requests/Payload';

export default class PictureProfileOperation {
    private readonly _pictureProfileService;
    private readonly _logger;

    constructor({ logger, pictureProfileService }: PictureProfileOperationContract) {
        this._pictureProfileService = pictureProfileService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ userId, image }: UserImagePayload): Promise<UserInstance> {
        this._logger('info', 'Execute - PictureProfileOperation');
        return this._pictureProfileService.uploadPicture({ userId, image });
    }
}
