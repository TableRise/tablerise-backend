import { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { AddCampaignPlayersPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class AddCampaignPlayersOperation {
    private readonly addCampaignPlayersService;
    private readonly logger;

    constructor({
        addCampaignPlayersService,
        logger,
    }: CampaignCoreDependencies['addCampaignPlayersOperationContract']) {
        this.addCampaignPlayersService = addCampaignPlayersService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: AddCampaignPlayersPayload): Promise<Player[]> {
        this.logger('info', 'Execute - AddCampaignPlayersOperation');
        const { campaign, userDetails } = await this.addCampaignPlayersService.addCampaignPlayers(payload);

        const savedCampaign = await this.addCampaignPlayersService.save(campaign, userDetails);

        return savedCampaign.campaignPlayers;
    }
}
