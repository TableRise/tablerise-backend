import { updateMatchDatePayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class updateMatchDateOperation {
    private readonly _updateMatchDateService;
    private readonly _campaignsSchema;
    private readonly _schemaValidator;
    private readonly _logger;

    constructor({
        updateMatchDateService,
        campaignsSchema,
        schemaValidator,
        logger,
    }: CampaignCoreDependencies['updateMatchDateOperationContract']) {
        this._updateMatchDateService = updateMatchDateService;
        this._schemaValidator = schemaValidator;
        this._campaignsSchema = campaignsSchema;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: updateMatchDatePayload): Promise<string> {
        this._logger('info', 'Execute - updateMatchDateOperation');
        this._schemaValidator.entry(this._campaignsSchema.campaignsUpdateMatchDateZod, payload);

        const campaignWithOperationDone = await this._updateMatchDateService.updateMatchDate(payload);
        const savedCampaign = await this._updateMatchDateService.save(campaignWithOperationDone);

        return savedCampaign.infos.nextMatchDate;
    }
}
