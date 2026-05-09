import { DeleteCampaignJournalPostPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class DeleteCampaignJournalPostOperation {
    private readonly logger;
    private readonly socketIO;
    private readonly deleteCampaignJournalPostService;

    constructor({
        logger,
        socketIO,
        deleteCampaignJournalPostService,
    }: CampaignCoreDependencies['deleteCampaignJournalPostOperationContract']) {
        this.deleteCampaignJournalPostService = deleteCampaignJournalPostService;
        this.socketIO = socketIO;
        this.logger = logger;
    }

    public async execute(payload: DeleteCampaignJournalPostPayload): Promise<void> {
        this.logger('info', 'Execute - DeleteCampaignJournalPostOperation');

        const { campaign } = await this.deleteCampaignJournalPostService.deletePost(payload);
        const savedCampaign = await this.deleteCampaignJournalPostService.save(campaign);

        this.socketIO.syncActiveCampaign(savedCampaign);
        this.socketIO.emitToCampaign(payload.campaignId, 'journal:post_deleted', {
            campaignId: payload.campaignId,
            postId: payload.postId,
            userId: payload.userId,
        });
    }
}
