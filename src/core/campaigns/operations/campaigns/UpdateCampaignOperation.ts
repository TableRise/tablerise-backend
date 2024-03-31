import { CampaignUpdatePayload } from 'src/domains/campaigns/schemas/campaignsUpdateValidationSchema';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateCampaignOperation {
    private readonly _campaignsSchema;
    private readonly _schemaValidator;
    private readonly _updateCampaignService;
    private readonly _logger;

    constructor({
        campaignsSchema,
        schemaValidator,
        updateCampaignService,
        logger,
    }: CampaignCoreDependencies['updateCampaignOperationContract']) {
        this._campaignsSchema = campaignsSchema;
        this._schemaValidator = schemaValidator;
        this._updateCampaignService = updateCampaignService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: CampaignUpdatePayload): Promise<CampaignInstance> {
        this._logger('info', 'Execute - UpdateCampaignOperation');
        this._schemaValidator.entry(this._campaignsSchema.campaignUpdateZod, payload);

        const campaignUpdated = await this._updateCampaignService.update(payload);
        const campaignSaved = await this._updateCampaignService.save(campaignUpdated);

        return campaignSaved;
    }
}
