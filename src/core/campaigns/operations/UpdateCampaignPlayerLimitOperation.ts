import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateCampaignPlayerLimitOperation {
    private readonly logger;
    private readonly updateCampaignPlayerLimitService;

    constructor({
        logger,
        updateCampaignPlayerLimitService,
    }: CampaignCoreDependencies['updateCampaignPlayerLimitOperationContract']) {
        this.updateCampaignPlayerLimitService = updateCampaignPlayerLimitService;
        this.logger = logger;
    }

    async execute(campaignId: string, newLimit: number): Promise<void> {
        this.logger('info', 'Execute - updateMatchDateOperation');
        await this.updateCampaignPlayerLimitService.updatePlayerLimit(campaignId, newLimit);
    }
}
