import { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { RemoveCampaignPlayersPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class RemoveCampaignPlayersOperation {
    private readonly removeCampaignPlayersService;
    private readonly socketIO;
    private readonly logger;

    constructor({
        removeCampaignPlayersService,
        socketIO,
        logger,
    }: CampaignCoreDependencies['removeCampaignPlayersOperationContract']) {
        this.removeCampaignPlayersService = removeCampaignPlayersService;
        this.socketIO = socketIO;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: RemoveCampaignPlayersPayload): Promise<Player[]> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        const { campaign, userDetails, removedPlayer } = await this.removeCampaignPlayersService.removeCampaignPlayers(
            payload
        );

        const savedCampaign = await this.removeCampaignPlayersService.save(campaign, userDetails);

        this.socketIO.syncActiveCampaign(savedCampaign);
        this.socketIO.emitToCampaign(payload.campaignId, 'campaign:player_left', {
            campaignId: payload.campaignId,
            userId: payload.userId,
            player: removedPlayer ?? null,
        });

        return savedCampaign.campaignPlayers;
    }
}
