import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { FileObject } from 'src/types/shared/file';

export default class UpdateCampaignCoverService {
    private readonly campaignsRepository;
    private readonly imageStorageClient;
    private readonly logger;

    constructor({
        campaignsRepository,
        imageStorageClient,
        logger,
    }: CampaignCoreDependencies['updateCampaignCoverServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.imageStorageClient = imageStorageClient;
        this.logger = logger;
    }

    async updateCover({ campaignId, picture }: { campaignId: string; picture: FileObject }): Promise<Campaign> {
        this.logger('info', 'UpdateCover - UpdateCampaignCoverService');

        const campaign = await this.campaignsRepository.findOne({ campaignId });
        const uploaded = await this.imageStorageClient.upload(picture);
        campaign.cover = uploaded;

        return campaign;
    }

    async save(campaign: Campaign): Promise<Campaign> {
        this.logger('info', 'Save - UpdateCampaignCoverService');
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
