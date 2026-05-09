import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { publishmentPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class PublishmentOperation {
    private readonly publishmentService;
    private readonly socketIO;
    private readonly logger;

    constructor({ publishmentService, socketIO, logger }: CampaignCoreDependencies['publishmentOperationContract']) {
        this.publishmentService = publishmentService;
        this.socketIO = socketIO;
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

        const savedCampaign = await this.publishmentService.save(campaignWithPost);
        const createdPost = savedCampaign.infos.journal[savedCampaign.infos.journal.length - 1];

        this.socketIO.syncActiveCampaign(savedCampaign);
        this.socketIO.emitToCampaign(campaignId, 'journal:post_created', {
            campaignId,
            post: createdPost,
        });

        return savedCampaign;
    }
}
