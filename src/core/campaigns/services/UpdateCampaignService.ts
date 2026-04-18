import { TUpdateCampaignBody } from 'src/interface/campaigns/presentation/campaigns/CampaignsSchemas';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { FileObject } from 'src/types/shared/file';

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

    async update({ campaignId, title, description, visibility, cover }: TUpdateCampaignBody & { campaignId: string }): Promise<Campaign> {
        this.logger('info', 'Update - UpdateCampaignService');
        const campaignInDb = await this.campaignsRepository.findOne({ campaignId });

        campaignInDb.title = title ?? campaignInDb.title;
        campaignInDb.description = description ?? campaignInDb.description;
        campaignInDb.infos.visibility = (visibility as 'hidden' | 'visible') ?? campaignInDb.infos.visibility;

        if (cover) campaignInDb.cover = await this.imageStorageClient.upload(cover as unknown as FileObject);

        return campaignInDb;
    }

    async save(campaign: Campaign): Promise<Campaign> {
        this.logger('info', 'Save - UpdateCampaignService');
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
