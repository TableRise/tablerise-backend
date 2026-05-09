import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class ConfirmCampaignPlayerOperation {
    private readonly confirmCampaignPlayerService;
    private readonly socketIO;
    private readonly logger;

    constructor({
        logger,
        confirmCampaignPlayerService,
        socketIO,
    }: CampaignCoreDependencies['confirmCampaignPlayerOperationContract']) {
        this.confirmCampaignPlayerService = confirmCampaignPlayerService;
        this.socketIO = socketIO;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(campaignId: string, userId: string, userToActivate: string): Promise<void> {
        this.logger('info', 'Execute - ConfirmCampaignPlayerOperation');
        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
        const savedCampaign = await this.confirmCampaignPlayerService.confirm(campaignId, userId, userToActivate);
        this.socketIO.syncActiveCampaign(savedCampaign);
        const player = savedCampaign.campaignPlayers.find(
            (campaignPlayer: { userId: string }) => campaignPlayer.userId === userToActivate
        );

        this.socketIO.emitToCampaign(campaignId, 'campaign:player_joined', {
            campaignId,
            player,
        });
    }
}
