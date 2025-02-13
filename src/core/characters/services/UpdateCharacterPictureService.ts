import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import { UpdateCharacterPicturePayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class UpdateCharacterPictureService {
    private readonly _charactersRepository;
    private readonly _imageStorageClient;
    private readonly _logger;

    constructor({
        charactersRepository,
        imageStorageClient,
        logger,
    }: CharacterCoreDependencies['updateCharacterPictureOperationService']) {
        this._charactersRepository = charactersRepository;
        this._imageStorageClient = imageStorageClient;
        this._logger = logger;

        this.updateCharacterPicture = this.updateCharacterPicture.bind(this);
    }

    public async updateCharacterPicture(
        payload: UpdateCharacterPicturePayload
    ): Promise<CharacterInstance> {
        this._logger('info', 'UpdateCharacterPicture - UpdateCharacterPictureService');
        const { characterId, image } = payload;
        const characterInDb = await this._charactersRepository.findOne({ characterId });

        characterInDb.picture = await this._imageStorageClient.upload(image);

        return this._charactersRepository.update({
            query: { characterId: characterInDb.characterId },
            payload: characterInDb,
        });
    }
}
