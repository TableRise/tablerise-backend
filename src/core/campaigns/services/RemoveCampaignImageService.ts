import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class RemoveCampaignImageService {
    private readonly campaignsRepository;
    private readonly logger;

    constructor({ campaignsRepository, logger }: CampaignCoreDependencies['removeCampaignImageServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    async removeImage({
        campaignId,
        imageUrl,
        type,
    }: {
        campaignId: string;
        imageUrl: string;
        type: 'cover' | 'mapImages';
    }): Promise<Campaign> {
        this.logger('info', 'RemoveImage - RemoveCampaignImageService');

        const campaign = await this.campaignsRepository.findOne({ campaignId });

        if (type === 'cover') {
            (campaign as unknown as { cover: ImageObject | null }).cover = null;
        }

        if (type === 'mapImages' && campaign.matchData) {
            campaign.matchData.mapImages = campaign.matchData.mapImages.filter(
                (img: ImageObject) => img.link !== imageUrl
            );
        }

        return campaign;
    }

    async save(campaign: Campaign): Promise<Campaign> {
        this.logger('info', 'Save - RemoveCampaignImageService');
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
