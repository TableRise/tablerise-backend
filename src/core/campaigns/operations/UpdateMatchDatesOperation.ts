import { UpdateMatchDatesPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateMatchDatesOperation {
    private readonly _updateMatchDatesService;
    private readonly _campaignsSchema;
    private readonly _schemaValidator;
    private readonly _logger;

    constructor({
        updateMatchDatesService,
        campaignsSchema,
        schemaValidator,
        logger,
    }: CampaignCoreDependencies['updateMatchDatesOperationContract']) {
        this._updateMatchDatesService = updateMatchDatesService;
        this._schemaValidator = schemaValidator;
        this._campaignsSchema = campaignsSchema;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: UpdateMatchDatesPayload): Promise<string[]> {
        this._logger('info', 'Execute - UpdateMatchDatesOperation');
        this._schemaValidator.entry(
            this._campaignsSchema.campaignsUpdateMatchDatesZod,
            payload
        );

        const campaignWithOperationDone =
            await this._updateMatchDatesService.updateMatchDates(payload);
        const savedCampaign = await this._updateMatchDatesService.save(
            campaignWithOperationDone
        );

        return savedCampaign.infos.matchDates;
    }
}
