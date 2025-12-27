import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { publishmentPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class PublishmentOperation {
    private readonly publishmentService;
    private readonly schemaValidator;
    private readonly campaignsSchema;
    private readonly logger;

    constructor({
        publishmentService,
        schemaValidator,
        campaignsSchema,
        logger,
    }: CampaignCoreDependencies['publishmentOperationContract']) {
        this.publishmentService = publishmentService;
        this.schemaValidator = schemaValidator;
        this.campaignsSchema = campaignsSchema;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute({ campaignId, userId, payload }: publishmentPayload): Promise<CampaignInstance> {
        this.logger('info', 'Execute - publishmentOperation');
        const campaignWithPost = await this.publishmentService.addPost({
            campaignId,
            userId,
            payload,
        });

        return this.publishmentService.save(campaignWithPost);
    }
}
