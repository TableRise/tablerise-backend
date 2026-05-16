import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class DeleteCampaignOperation {
    private readonly deleteCampaignService;
    private readonly logger;

    constructor({ deleteCampaignService, logger }: CampaignCoreDependencies['deleteCampaignOperationContract']) {
        this.deleteCampaignService = deleteCampaignService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(campaignId: string, userId: string): Promise<void> {
        this.logger('info', 'Execute - DeleteCampaignOperation');
        await this.deleteCampaignService.deleteCampaign(campaignId, userId);
    }
}
