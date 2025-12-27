import { CampaignUpdatePayload } from 'src/domains/campaigns/schemas/campaignsUpdateValidationSchema';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateCampaignOperation {
    private readonly campaignsSchema;
    private readonly schemaValidator;
    private readonly updateCampaignService;
    private readonly logger;

    constructor({
        campaignsSchema,
        schemaValidator,
        updateCampaignService,
        logger,
    }: CampaignCoreDependencies['updateCampaignOperationContract']) {
        this.campaignsSchema = campaignsSchema;
        this.schemaValidator = schemaValidator;
        this.updateCampaignService = updateCampaignService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: CampaignUpdatePayload): Promise<CampaignInstance> {
        this.logger('info', 'Execute - UpdateCampaignOperation');
        const campaignUpdated = await this.updateCampaignService.update(payload);
        return this.updateCampaignService.save(campaignUpdated);
    }
}
