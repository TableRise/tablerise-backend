import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { PublishPostPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class PublishPostOperation {
    private readonly _publishPostService;
    private readonly _schemaValidator;
    private readonly _campaignsSchema;
    private readonly _logger;

    constructor({
        publishPostService,
        schemaValidator,
        campaignsSchema,
        logger,
    }: CampaignCoreDependencies['publishPostOperationContract']) {
        this._publishPostService = publishPostService;
        this._schemaValidator = schemaValidator;
        this._campaignsSchema = campaignsSchema;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute({ campaignId, userId, payload }: PublishPostPayload): Promise<CampaignInstance> {
        this._logger('info', 'Execute - PublishPostOperation');
        // console.log(payload)
        this._schemaValidator.entry(this._campaignsSchema.campaignPost, payload);

        const campaignWithPost = await this._publishPostService.addPost({ campaignId, userId, payload });
        const campaignSaved = await this._publishPostService.save(campaignWithPost);

        return campaignSaved;
    }
}
