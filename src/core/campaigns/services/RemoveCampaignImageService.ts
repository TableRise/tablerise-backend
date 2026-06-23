import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class RemoveCampaignImageService {
    private readonly campaignsRepository;
    private readonly internalRepository;
    private readonly logger;

    constructor({
        campaignsRepository,
        internalRepository,
        logger,
    }: CampaignCoreDependencies['removeCampaignImageServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.internalRepository = internalRepository;
        this.logger = logger;
    }

    async removeCover({ campaignId }: { campaignId: string }): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.removeCover.name}`;
        this.logger('info', callName);

        const campaign = await this.campaignsRepository.findOne({ campaignId });
        this.internalRepository.addImageForDeletion(campaign.cover);
        (campaign as unknown as { cover: ImageObject | null }).cover = null;

        return campaign;
    }

    async removeMatchMapImage({ campaignId, imageUrl }: { campaignId: string; imageUrl: string }): Promise<Campaign> {
        this.logger('info', 'RemoveMatchMapImage - RemoveCampaignImageService');

        const campaign = await this.campaignsRepository.findOne({ campaignId });

        if (campaign.matchData) {
            const removedImages = campaign.matchData.mapImages.filter((img: ImageObject) => img.link === imageUrl);
            campaign.matchData.mapImages = campaign.matchData.mapImages.filter(
                (img: ImageObject) => img.link !== imageUrl
            );
            removedImages.forEach((image) => this.internalRepository.addImageForDeletion(image));

            const activeMapId = (campaign.matchData as any).state?.activeMapId;

            if (activeMapId) {
                const activeMapStillExists = campaign.matchData.mapImages.some(
                    (img: ImageObject) => img.id === activeMapId
                );

                if (!activeMapStillExists) {
                    (campaign.matchData as any).state.activeMapId = null;
                }
            }
        }

        return campaign;
    }

    async save(campaign: Campaign): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.save.name}`;
        this.logger('info', callName);
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
