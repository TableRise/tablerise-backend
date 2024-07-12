import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { publishmentPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class PublishmentOperation {
    private readonly _publishmentService;
    private readonly _schemaValidator;
    private readonly _campaignsSchema;
    private readonly _logger;

    constructor({
        publishmentService,
        schemaValidator,
        campaignsSchema,
        logger,
    }: CampaignCoreDependencies['publishmentOperationContract']) {
        this._publishmentService = publishmentService;
        this._schemaValidator = schemaValidator;
        this._campaignsSchema = campaignsSchema;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute({
        campaignId,
        userId,
        payload,
    }: publishmentPayload): Promise<CampaignInstance> {
        this._logger('info', 'Execute - publishmentOperation');
        this._schemaValidator.entry(this._campaignsSchema.campaignPost, payload);

        const campaignWithPost = await this._publishmentService.addPost({
            campaignId,
            userId,
            payload,
        });
        const campaignSaved = await this._publishmentService.save(campaignWithPost);

        return campaignSaved;
    }
}
