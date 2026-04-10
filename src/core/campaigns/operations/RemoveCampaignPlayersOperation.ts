import { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { RemoveCampaignPlayersPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class RemoveCampaignPlayersOperation {
    private readonly removeCampaignPlayersService;
    private readonly logger;

    constructor({
        removeCampaignPlayersService,
        logger,
    }: CampaignCoreDependencies['removeCampaignPlayersOperationContract']) {
        this.removeCampaignPlayersService = removeCampaignPlayersService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: RemoveCampaignPlayersPayload): Promise<Player[]> {
        this.logger('info', 'Execute - RemoveCampaignPlayersOperation');
        const { campaign, userDetails } = await this.removeCampaignPlayersService.removeCampaignPlayers(payload);

        const savedCampaign = await this.removeCampaignPlayersService.save(campaign, userDetails);

        return savedCampaign.campaignPlayers;
    }
}
