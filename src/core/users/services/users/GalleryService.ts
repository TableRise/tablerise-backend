import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { GalleryLookupPayload, UserGalleryItem } from 'src/types/api/users/http/payload';
import { ensureUserDetailCollections } from 'src/domains/users/helpers/UserDetailCollections';

export default class GalleryService {
    private readonly usersDetailsRepository;
    private readonly logger;

    constructor({ usersDetailsRepository, logger }: UserCoreDependencies['galleryServiceContract']) {
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;
    }

    public async getAll(userId: string): Promise<UserGalleryItem[]> {
        const callName = `[${this.constructor.name}] - ${this.getAll.name}`;
        this.logger('info', callName);

        const userDetails = await this.usersDetailsRepository.findOne({ userId });
        ensureUserDetailCollections(userDetails);

        return userDetails.gallery;
    }

    public async getById({ userId, imageId }: GalleryLookupPayload): Promise<UserGalleryItem> {
        const callName = `[${this.constructor.name}] - ${this.getById.name}`;
        this.logger('info', callName);

        const userDetails = await this.usersDetailsRepository.findOne({ userId });
        ensureUserDetailCollections(userDetails);

        const image = userDetails.gallery.find((entry) => entry.id === imageId);
        if (!image) {
            throw new HttpRequestErrors({
                message: 'Gallery image does not exist',
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });
        }

        return image;
    }

    public async remove({ userId, imageId }: GalleryLookupPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.remove.name}`;
        this.logger('info', callName);

        const userDetails = await this.usersDetailsRepository.findOne({ userId });
        ensureUserDetailCollections(userDetails);

        const previousLength = userDetails.gallery.length;
        userDetails.gallery = userDetails.gallery.filter((entry) => entry.id !== imageId);

        if (previousLength === userDetails.gallery.length) {
            throw new HttpRequestErrors({
                message: 'Gallery image does not exist',
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });
        }

        await this.usersDetailsRepository.update({
            query: { userDetailId: userDetails.userDetailId },
            payload: userDetails,
        });
    }
}
