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
        mapImages,
    }: TUpdateCampaignMatchMapImagesBody & { campaignId: string }): Promise<Campaign> {
        this.logger('info', 'UpdateMatchMapImage - UpdateMatchMapImagesService');
        const campaign = await this.campaignsRepository.findOne({ campaignId });

        if (mapImages && campaign.matchData) {
            for (const file of mapImages) {
                const uploaded = await this.imageStorageClient.upload(file as unknown as FileObject);
                campaign.matchData.mapImages.push(uploaded);
            }
        }

        return campaign;
    }

    async save(campaign: Campaign): Promise<Campaign> {
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
