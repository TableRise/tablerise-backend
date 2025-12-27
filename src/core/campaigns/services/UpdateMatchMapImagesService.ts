import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { UpdateMatchMapImagesPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateMatchMapImagesService {
    private readonly campaignsRepository;
    private readonly imageStorageClient;
    private readonly logger;

    constructor({
        campaignsRepository,
        imageStorageClient,
        logger,
    }: CampaignCoreDependencies['updateMatchMapImagesServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.imageStorageClient = imageStorageClient;
        this.logger = logger;
    }

    async updateMatchMapImage({
        campaignId,
        mapImage,
        operation,
        imageId,
    }: UpdateMatchMapImagesPayload): Promise<CampaignInstance> {
        this.logger('info', 'UpdateMatchMapImage - UpdateMatchMapImagesService');
        const campaign = await this.campaignsRepository.findOne({ campaignId });
        const imageUploadResponse = mapImage && (await this.imageStorageClient.upload(mapImage));

        if (operation === 'add' && imageUploadResponse && campaign.matchData)
            campaign.matchData.mapImages.push(imageUploadResponse);

        if (operation === 'remove' && campaign.matchData)
            campaign.matchData.mapImages = campaign.matchData.mapImages.filter((mapImage) => mapImage.id !== imageId);

        return campaign;
    }

    async save(campaign: CampaignInstance): Promise<CampaignInstance> {
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
