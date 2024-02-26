import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UserImagePayload } from 'src/types/api/users/http/payload';

export default class PictureProfileService {
    private readonly _usersRepository;
    private readonly _imageStorageClient;
    private readonly _logger;

    constructor({
        usersRepository,
        imageStorageClient,
        logger,
    }: UserCoreDependencies['pictureProfileServiceContract']) {
        this._usersRepository = usersRepository;
        this._imageStorageClient = imageStorageClient;
        this._logger = logger;

        this.uploadPicture = this.uploadPicture.bind(this);
    }

    private _verifyLastUpdate(user: UserInstance): void {
        if (user.picture?.id) {
            const dateFirst = new Date(user.picture.uploadDate);
            const dateLast = new Date();

            const diffTime = dateLast.getTime() - dateFirst.getTime();
            const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

            if (diffDays - 1 < 15)
                throw new HttpRequestErrors({
                    message: 'You only can upload a new profile picture one time in 15-days',
                    name: getErrorName(HttpStatusCode.FORBIDDEN),
                    code: HttpStatusCode.FORBIDDEN,
                });
        }
    }

    public async uploadPicture({ userId, image }: UserImagePayload): Promise<UserInstance> {
        this._logger('info', 'UploadPicture - PictureProfileService');
        const userInDb = await this._usersRepository.findOne({ userId });

        this._verifyLastUpdate(userInDb);

        const response = await this._imageStorageClient.upload(image);

        userInDb.picture = {
            id: response.data.id,
            link: response.data.link,
            uploadDate: new Date(),
        };

        return this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userInDb,
        });
    }
}
