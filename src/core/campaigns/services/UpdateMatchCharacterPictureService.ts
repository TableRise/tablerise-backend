import Campaign, { CharacterInGame } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { FileObject } from 'src/types/shared/file';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';

export default class UpdateMatchCharacterPictureService {
    private readonly campaignsRepository;
    private readonly imageStorageClient;
    private readonly logger;

    constructor({
        campaignsRepository,
        imageStorageClient,
        logger,
    }: CampaignCoreDependencies['updateMatchCharacterPictureServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.imageStorageClient = imageStorageClient;
        this.logger = logger;
    }

    async updatePicture({
        campaignId,
        characterId,
        picture,
    }: {
        campaignId: string;
        characterId: string;
        picture: FileObject;
    }): Promise<{ campaign: Campaign; uploaded: ImageObject }> {
        this.logger('info', 'UpdatePicture - UpdateMatchCharacterPictureService');

        const campaign = await this.campaignsRepository.findOne({ campaignId });

        if (!campaign.matchData) HttpRequestErrors.throwError('campaign-match-inexistent');

        const characterIndex = campaign.matchData.charactersInGame.findIndex(
            (c: CharacterInGame) => c.characterId === characterId
        );

        if (characterIndex === -1) HttpRequestErrors.throwError('campaign-player-not-exists');

        const uploaded = await this.imageStorageClient.upload(picture);
        campaign.matchData.charactersInGame[characterIndex].picture = uploaded;

        return { campaign, uploaded };
    }

    async save(campaign: Campaign): Promise<Campaign> {
        this.logger('info', 'Save - UpdateMatchCharacterPictureService');
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
