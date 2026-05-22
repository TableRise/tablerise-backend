import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class TransferDungeonMasterOperation {
    private readonly transferDungeonMasterService;
    private readonly socketIO;
    private readonly logger;

    constructor({
        logger,
        transferDungeonMasterService,
        socketIO,
    }: CampaignCoreDependencies['transferDungeonMasterOperationContract']) {
        this.transferDungeonMasterService = transferDungeonMasterService;
        this.socketIO = socketIO;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(campaignId: string, userId: string, userToMaster: string): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        const savedCampaign = await this.transferDungeonMasterService.transfer(campaignId, userId, userToMaster);
        this.socketIO.syncActiveCampaign(savedCampaign);
        this.socketIO.emitToCampaign(campaignId, 'campaign:dungeon_master_transferred', {
            campaignId,
            previousDungeonMasterId: userId,
            newDungeonMasterId: userToMaster,
        });
    }
}
