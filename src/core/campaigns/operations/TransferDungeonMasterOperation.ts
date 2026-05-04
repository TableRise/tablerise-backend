import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class TransferDungeonMasterOperation {
    private readonly transferDungeonMasterService;
    private readonly logger;

    constructor({
        logger,
        transferDungeonMasterService,
    }: CampaignCoreDependencies['transferDungeonMasterOperationContract']) {
        this.transferDungeonMasterService = transferDungeonMasterService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(campaignId: string, userId: string, userToMaster: string): Promise<void> {
        this.logger('info', 'Execute - TransferDungeonMasterOperation');
        await this.transferDungeonMasterService.transfer(campaignId, userId, userToMaster);
    }
}
