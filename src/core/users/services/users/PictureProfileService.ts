import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UserImagePayload } from 'src/types/api/users/http/payload';
import daysDifference from 'src/domains/common/helpers/daysDifference';

export default class PictureProfileService {
    private readonly usersRepository;
    private readonly imageStorageClient;
    private readonly logger;

    constructor({
        usersRepository,
        imageStorageClient,
        logger,
    }: UserCoreDependencies['pictureProfileServiceContract']) {
        this.usersRepository = usersRepository;
        this.imageStorageClient = imageStorageClient;
        this.logger = logger;

        this.uploadPicture = this.uploadPicture.bind(this);
    }

    private verifyLastUpdate(user: User): void {
        if (user.picture?.id) {
            const dateFirst = new Date(user.picture.uploadDate).getTime();

            if (!daysDifference(dateFirst, 15))
                throw new HttpRequestErrors({
                    message: 'You only can upload a new profile picture one time in 15-days',
                    name: getErrorName(HttpStatusCode.FORBIDDEN),
                    code: HttpStatusCode.FORBIDDEN,
                });
        }
    }

    public async uploadPicture({ userId, image }: UserImagePayload): Promise<User> {
        const callName = `[${this.constructor.name}] - ${this.uploadPicture.name}`;
        this.logger('info', callName);
        const userInDb = await this.usersRepository.findOne({ userId });

        this.verifyLastUpdate(userInDb);

        userInDb.picture = await this.imageStorageClient.upload(image);

        return this.usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userInDb,
        });
    }
}
