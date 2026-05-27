import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { FileObject } from 'src/types/shared/file';

export default class UpdateMatchCharacterPictureOperation {
    private readonly updateMatchCharacterPictureService;
    private readonly logger;

    constructor({
        updateMatchCharacterPictureService,
        logger,
    }: CampaignCoreDependencies['updateMatchCharacterPictureOperationContract']) {
        this.updateMatchCharacterPictureService = updateMatchCharacterPictureService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute({
        campaignId,
        characterId,
        picture,
    }: {
        campaignId: string;
        characterId: string;
        picture: FileObject;
    }): Promise<ImageObject> {
        this.logger('info', 'Execute - UpdateMatchCharacterPictureOperation');

        const { campaign, uploaded } = await this.updateMatchCharacterPictureService.updatePicture({
            campaignId,
            characterId,
            picture,
        });

        await this.updateMatchCharacterPictureService.save(campaign);

        return uploaded;
    }
}
