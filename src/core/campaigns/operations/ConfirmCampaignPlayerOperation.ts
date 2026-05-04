import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class ConfirmCampaignPlayerOperation {
    private readonly confirmCampaignPlayerService;
    private readonly logger;

    constructor({
        logger,
        confirmCampaignPlayerService,
    }: CampaignCoreDependencies['confirmCampaignPlayerOperationContract']) {
        this.confirmCampaignPlayerService = confirmCampaignPlayerService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(campaignId: string, userId: string, userToActivate: string): Promise<void> {
        this.logger('info', 'Execute - ConfirmCampaignPlayerOperation');
        await this.confirmCampaignPlayerService.confirm(campaignId, userId, userToActivate);
    }
}
