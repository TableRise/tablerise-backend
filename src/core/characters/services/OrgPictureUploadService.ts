import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { orgPicturePayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class OrgPictureUploadService {
    private readonly logger;
    private readonly characterRepository;
    private readonly imageStorageClient;

    constructor({
        logger,
        charactersRepository,
        imageStorageClient,
    }: CharacterCoreDependencies['orgPictureUploadServiceContract']) {
        this.characterRepository = charactersRepository;
        this.imageStorageClient = imageStorageClient;
        this.logger = logger;

        this.uploadPicture = this.uploadPicture.bind(this);
    }

    public async uploadPicture({ characterId, image, orgName }: orgPicturePayload): Promise<CharactersDnd> {
        this.logger('info', 'UploadPicture - OrgPictureUploadService');
        const characterInDb = await this.characterRepository.findOne({ characterId });
        const allyOrOrgIndex = characterInDb.data.profile.characteristics.alliesAndOrgs.findIndex(
            (ally) => ally.orgName === orgName
        );

        if (allyOrOrgIndex === -1) {
            throw new Error('Organization not found');
        }

        characterInDb.data.profile.characteristics.alliesAndOrgs[allyOrOrgIndex].symbol =
            await this.imageStorageClient.upload(image);

        return this.characterRepository.update({
            query: { characterId: characterInDb.characterId },
            payload: characterInDb,
        });
    }
}
