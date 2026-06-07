import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { UpdateCharacterPicturePayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import { appendGalleryImage } from 'src/domains/users/helpers/UserDetailCollections';
import { resolveImageUpload } from 'src/domains/common/helpers/resolveImageUpload';

export default class UpdateCharacterPictureService {
    private readonly charactersRepository;
    private readonly usersDetailsRepository;
    private readonly imageStorageClient;
    private readonly logger;

    constructor({
        charactersRepository,
        usersDetailsRepository,
        imageStorageClient,
        logger,
    }: CharacterCoreDependencies['updateCharacterPictureOperationService']) {
        this.charactersRepository = charactersRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.imageStorageClient = imageStorageClient;
        this.logger = logger;

        this.uploadPicture = this.uploadPicture.bind(this);
    }

    public async uploadPicture(payload: UpdateCharacterPicturePayload): Promise<CharactersDnd> {
        const callName = `[${this.constructor.name}] - ${this.uploadPicture.name}`;
        this.logger('info', callName);
        const { characterId, image, imageObject, userId } = payload;
        const characterInDb = await this.charactersRepository.findOne({ characterId });

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
        characterInDb.picture = uploaded;

        const userDetails = await this.usersDetailsRepository.findOne({ userId });
        if (!userDetails) HttpRequestErrors.throwError('user-inexistent');

        if (imageObject === undefined) {
            appendGalleryImage(userDetails, uploaded);
        }

        await this.usersDetailsRepository.update({
            query: { userDetailId: userDetails.userDetailId },
            payload: userDetails,
        });

        return this.charactersRepository.update({
            query: { characterId: characterInDb.characterId },
            payload: characterInDb,
        });
    }
}
