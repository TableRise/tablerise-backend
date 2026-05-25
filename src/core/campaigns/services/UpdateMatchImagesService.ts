import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { TUpdateCampaignMatchImagesBody } from 'src/interface/campaigns/presentation/campaigns/CampaignsSchemas';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { FileObject } from 'src/types/shared/file';

export default class UpdateMatchImagesService {
    private readonly campaignsRepository;
    private readonly imageStorageClient;
    private readonly logger;

    constructor({
        campaignsRepository,
        imageStorageClient,
        logger,
    }: CampaignCoreDependencies['updateMatchImagesServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.imageStorageClient = imageStorageClient;
        this.logger = logger;
    }

    public async updateMatchImages({
        campaignId,
        images,
    }: TUpdateCampaignMatchImagesBody & { campaignId: string }): Promise<Campaign> {
        this.logger('info', 'UpdateMatchImages - UpdateMatchImagesService');
        const campaign = await this.campaignsRepository.findOne({ campaignId });

        if (images && campaign.matchData) {
            campaign.matchData.images = campaign.matchData.images ?? [];

            for (const file of images) {
                const uploaded = await this.imageStorageClient.upload(file as unknown as FileObject);
                campaign.matchData.images.push(uploaded);
            }
        }

        return campaign;
    }

    public async save(campaign: Campaign): Promise<Campaign> {
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
