import { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { RemoveCampaignPlayersPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class RemoveCampaignPlayersOperation {
    private readonly _removeCampaignPlayersService;
    private readonly _schemaValidator;
    private readonly _campaignsSchema;
    private readonly _logger;

    constructor({
        removeCampaignPlayersService,
        schemaValidator,
        campaignsSchema,
        logger,
    }: CampaignCoreDependencies['removeCampaignPlayersOperationContract']) {
        this._removeCampaignPlayersService = removeCampaignPlayersService;
        this._schemaValidator = schemaValidator;
        this._campaignsSchema = campaignsSchema;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: RemoveCampaignPlayersPayload): Promise<Player[]> {
        this._logger('info', 'Execute - RemoveCampaignPlayersOperation');

        this._schemaValidator.entry(this._campaignsSchema.campaignsRemoveCampaignPlayersZod, payload);

        const { campaign, userDetails } = await this._removeCampaignPlayersService.removeCampaignPlayers(payload);

        const savedCampaign = await this._removeCampaignPlayersService.save(campaign, userDetails);

        return savedCampaign.campaignPlayers;
    }
}
