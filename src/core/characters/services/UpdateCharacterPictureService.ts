import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import { UpdateCharacterPicturePayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class UpdateCharacterPictureService {
    private readonly charactersRepository;
    private readonly imageStorageClient;
    private readonly logger;

    constructor({
        charactersRepository,
        imageStorageClient,
        logger,
    }: CharacterCoreDependencies['updateCharacterPictureOperationService']) {
        this.charactersRepository = charactersRepository;
        this.imageStorageClient = imageStorageClient;
        this.logger = logger;

        this.uploadPicture = this.uploadPicture.bind(this);
    }

    public async uploadPicture(payload: UpdateCharacterPicturePayload): Promise<CharacterInstance> {
        this.logger('info', 'UpdateCharacterPicture - UpdateCharacterPictureService');
        const { characterId, image } = payload;
        const characterInDb = await this.charactersRepository.findOne({ characterId });

        characterInDb.picture = await this.imageStorageClient.upload(image);

        return this.charactersRepository.update({
            query: { characterId: characterInDb.characterId },
            payload: characterInDb,
        });
    }
}
