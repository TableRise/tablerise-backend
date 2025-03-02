import { CharacterInstance } from "src/domains/characters/schemas/characterPostValidationSchema";
import { orgPicturePayload } from "src/types/api/characters/http/payload";
import CharacterCoreDependencies from "src/types/modules/core/characters/CharacterCoreDependencies";

export default class OrgPictureUploadService {
    private readonly _logger;
    private readonly _characterRepository;
    private readonly _imageStorageClient;

    constructor({
        logger,
        charactersRepository,
        imageStorageClient,
    }: CharacterCoreDependencies['orgPictureUploadServiceContract']) {
        this._characterRepository = charactersRepository;
        this._imageStorageClient = imageStorageClient;
        this._logger = logger;

        this.uploadPicture = this.uploadPicture.bind(this);
    }

    public async uploadPicture({characterId, image, orgName}: orgPicturePayload): Promise<CharacterInstance> {
        this._logger('info', 'UploadPicture - OrgPictureUploadService');
        const characterInDb = await this._characterRepository.findOne({ characterId });
        const allyOrOrgIndex = characterInDb.data.profile.characteristics.alliesAndOrgs
            .findIndex((ally) => ally.orgName === orgName);

        characterInDb.data.profile.characteristics.alliesAndOrgs[allyOrOrgIndex].symbol = await this._imageStorageClient.upload(image);

        return this._characterRepository.update({
            query: { characterId: characterInDb.characterId },
            payload: characterInDb,
        });
    }
}