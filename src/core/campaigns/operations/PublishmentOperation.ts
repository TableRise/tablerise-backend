import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { publishmentPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class PublishmentOperation {
    private readonly publishmentService;
    private readonly logger;

    constructor({
        publishmentService,
        logger,
    }: CampaignCoreDependencies['publishmentOperationContract']) {
        this.publishmentService = publishmentService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute({ campaignId, userId, payload }: publishmentPayload): Promise<Campaign> {
        this.logger('info', 'Execute - publishmentOperation');
        const campaignWithPost = await this.publishmentService.addPost({
            campaignId,
            userId,
            payload,
        });

        return this.publishmentService.save(campaignWithPost);
    }
}
