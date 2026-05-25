import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateMatchHighlightedImageService {
    private readonly campaignsRepository;
    private readonly logger;

    constructor({
        campaignsRepository,
        logger,
    }: CampaignCoreDependencies['updateMatchHighlightedImageServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    public async updateMatchHighlightedImage({
        campaignId,
        imageId,
        remove,
    }: {
        campaignId: string;
        imageId?: string;
        remove?: boolean;
    }): Promise<Campaign> {
        this.logger('info', 'UpdateMatchHighlightedImage - UpdateMatchHighlightedImageService');
        const campaign = await this.campaignsRepository.findOne({ campaignId });

        if (remove) {
            campaign.matchData.imageHighlighted = null as any;
            return campaign;
        }

        const imageHighlighted = campaign.matchData?.images?.find((image) => image.id === imageId);

        if (!imageHighlighted) HttpRequestErrors.throwError('content-inexistent');

        campaign.matchData.imageHighlighted = imageHighlighted as Campaign['matchData']['imageHighlighted'];

        return campaign;
    }

    public async save(campaign: Campaign): Promise<Campaign> {
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
