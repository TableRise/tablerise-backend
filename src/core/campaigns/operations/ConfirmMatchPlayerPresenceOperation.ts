import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class ConfirmMatchPlayerPresenceOperation {
    private readonly confirmMatchPlayerPresenceService;
    private readonly logger;

    constructor({
        logger,
        confirmMatchPlayerPresenceService,
    }: CampaignCoreDependencies['confirmMatchPlayerPresenceOperationContract']) {
        this.confirmMatchPlayerPresenceService = confirmMatchPlayerPresenceService;
        this.logger = logger;
    }

    async execute(campaignId: string, userId: string, cancel: boolean): Promise<void> {
        this.logger('info', 'Execute - ConfirmMatchPlayerPresenceOperation');
        await this.confirmMatchPlayerPresenceService.confirmPresence(campaignId, userId, cancel);
    }
}
