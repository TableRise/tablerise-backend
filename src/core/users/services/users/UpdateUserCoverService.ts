import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import { UpdateUserCoverPayload } from 'src/types/api/users/http/payload';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { appendGalleryImage } from 'src/domains/users/helpers/UserDetailCollections';
import { resolveImageUpload } from 'src/domains/common/helpers/resolveImageUpload';

export default class UpdateUserCoverService {
    private readonly usersDetailsRepository;
    private readonly imageStorageClient;
    private readonly logger;

    constructor({
        usersDetailsRepository,
        imageStorageClient,
        logger,
    }: UserCoreDependencies['updateUserCoverServiceContract']) {
        this.usersDetailsRepository = usersDetailsRepository;
        this.imageStorageClient = imageStorageClient;
        this.logger = logger;

        this.update = this.update.bind(this);
    }

    public async update({ userId, image, imageObject }: UpdateUserCoverPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.update.name}`;
        this.logger('info', callName);

        const userDetails = await this.usersDetailsRepository.findOne({ userId });
        if (!userDetails) HttpRequestErrors.throwError('user-inexistent');

        const uploaded = await resolveImageUpload({
            image,
            imageObject,
            imageStorageClient: this.imageStorageClient,
        });
        if (!uploaded) {
            throw new HttpRequestErrors({
                message: 'An image file or imageObject is required',
                code: HttpStatusCode.BAD_REQUEST,
                name: getErrorName(HttpStatusCode.BAD_REQUEST),
            });
        }
        userDetails.cover = uploaded;

        if (imageObject === undefined) {
            appendGalleryImage(userDetails, uploaded);
        }

        await this.usersDetailsRepository.update({
            query: { userDetailId: userDetails.userDetailId },
            payload: userDetails,
        });
    }
}
