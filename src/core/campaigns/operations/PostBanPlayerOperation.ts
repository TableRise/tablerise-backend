import { PostBanPlayerPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class PostBanPlayerOperation {
    private readonly campaignsSchema;
    private readonly schemaValidator;
    private readonly postBanPlayerService;
    private readonly logger;

    constructor({
        campaignsSchema,
        schemaValidator,
        postBanPlayerService,
        logger,
    }: CampaignCoreDependencies['postBanPlayerOperation']) {
        this.campaignsSchema = campaignsSchema;
        this.schemaValidator = schemaValidator;
        this.postBanPlayerService = postBanPlayerService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ campaignId, playerId }: PostBanPlayerPayload): Promise<void> {
        this.logger('info', 'Execute - PostBanPlayerOperation');
        await this.postBanPlayerService.banPlayer({
            campaignId,
            playerId,
        });
    }
}
