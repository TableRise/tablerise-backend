import { CampaignUpdatePayload } from 'src/domains/campaigns/schemas/campaignsUpdateValidationSchema';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateCampaignService {
    private readonly campaignsRepository;
    private readonly imageStorageClient;
    private readonly logger;

    constructor({
        campaignsRepository,
        imageStorageClient,
        logger,
    }: CampaignCoreDependencies['updateCampaignServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.imageStorageClient = imageStorageClient;
        this.logger = logger;

        this.update = this.update.bind(this);
    }

    async update({
        campaignId,
        title,
        description,
        visibility,
        cover,
    }: CampaignUpdatePayload): Promise<CampaignInstance> {
        this.logger('info', 'Update - UpdateCampaignService');
        const campaignInDb = await this.campaignsRepository.findOne({ campaignId });

        campaignInDb.title = title ?? campaignInDb.title;
        campaignInDb.description = description ?? campaignInDb.description;
        campaignInDb.infos.visibility = (visibility as 'hidden' | 'visible') ?? campaignInDb.infos.visibility;

        if (cover) campaignInDb.cover = await this.imageStorageClient.upload(cover);

        return campaignInDb;
    }

    async save(campaign: CampaignInstance): Promise<CampaignInstance> {
        this.logger('info', 'Save - UpdateCampaignService');
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
