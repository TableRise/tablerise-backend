import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateCampaignPlayerLimitOperation {
    private readonly logger;
    private readonly updateCampaignPlayerLimitService;
    private readonly socketIO;

    constructor({
        logger,
        updateCampaignPlayerLimitService,
        socketIO,
    }: CampaignCoreDependencies['updateCampaignPlayerLimitOperationContract']) {
        this.updateCampaignPlayerLimitService = updateCampaignPlayerLimitService;
        this.socketIO = socketIO;
        this.logger = logger;
    }

    async execute(campaignId: string, newLimit: number): Promise<void> {
        this.logger('info', 'Execute - updateMatchDateOperation');
        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
        const savedCampaign = await this.updateCampaignPlayerLimitService.updatePlayerLimit(campaignId, newLimit);
        this.socketIO.syncActiveCampaign(savedCampaign);
        this.socketIO.emitToCampaign(campaignId, 'campaign:settings_updated', {
            campaignId,
            playerAmountLimit: savedCampaign.infos.playerAmountLimit,
        });
    }
}
