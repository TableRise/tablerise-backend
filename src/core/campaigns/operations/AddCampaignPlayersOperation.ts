import { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { AddCampaignPlayersPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class AddCampaignPlayersOperation {
    private readonly _addCampaignPlayersService;
    private readonly _schemaValidator;
    private readonly _campaignsSchema;
    private readonly _logger;

    constructor({
        addCampaignPlayersService,
        schemaValidator,
        campaignsSchema,
        logger,
    }: CampaignCoreDependencies['addCampaignPlayersOperationContract']) {
        this._addCampaignPlayersService = addCampaignPlayersService;
        this._schemaValidator = schemaValidator;
        this._campaignsSchema = campaignsSchema;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: AddCampaignPlayersPayload): Promise<Player[]> {
        this._logger('info', 'Execute - AddCampaignPlayersOperation');
        const { campaign, userDetails } = await this._addCampaignPlayersService.addCampaignPlayers(payload);

        const savedCampaign = await this._addCampaignPlayersService.save(campaign, userDetails);

        return savedCampaign.campaignPlayers;
    }
}
