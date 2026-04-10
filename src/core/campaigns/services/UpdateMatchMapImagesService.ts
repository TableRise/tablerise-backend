import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { TUpdateCampaignMatchMapImagesBody } from 'src/interface/campaigns/presentation/campaigns/CampaignsSchemas';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { FileObject } from 'src/types/shared/file';

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
        picture,
        operation,
        imageId,
    }: TUpdateCampaignMatchMapImagesBody & { campaignId: string }): Promise<Campaign> {
        this.logger('info', 'UpdateMatchMapImage - UpdateMatchMapImagesService');
        const campaign = await this.campaignsRepository.findOne({ campaignId });
        const imageUploadResponse = picture && (await this.imageStorageClient.upload(picture as unknown as FileObject));

        if (operation === 'add' && imageUploadResponse && campaign.matchData)
            campaign.matchData.mapImages.push(imageUploadResponse);

        if (operation === 'remove' && campaign.matchData)
            campaign.matchData.mapImages = campaign.matchData.mapImages.filter((mapImage) => mapImage.id !== imageId);

        return campaign;
    }

    async save(campaign: Campaign): Promise<Campaign> {
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
