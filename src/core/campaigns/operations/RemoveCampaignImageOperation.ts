import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class RemoveCampaignImageOperation {
    private readonly removeCampaignImageService;
    private readonly logger;

    constructor({
        removeCampaignImageService,
        logger,
    }: CampaignCoreDependencies['removeCampaignImageOperationContract']) {
        this.removeCampaignImageService = removeCampaignImageService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute({
        campaignId,
        imageUrl,
        type,
    }: {
        campaignId: string;
        imageUrl: string;
        type: 'cover' | 'mapImages';
    }): Promise<void> {
        this.logger('info', 'Execute - RemoveCampaignImageOperation');

        const campaignUpdated = await this.removeCampaignImageService.removeImage({ campaignId, imageUrl, type });
        await this.removeCampaignImageService.save(campaignUpdated);
    }
}
