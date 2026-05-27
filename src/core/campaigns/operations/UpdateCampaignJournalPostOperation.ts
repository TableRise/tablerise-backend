import { CampaignJournalPost, UpdateCampaignJournalPostPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateCampaignJournalPostOperation {
    private readonly logger;
    private readonly socketIO;
    private readonly updateCampaignJournalPostService;

    constructor({
        logger,
        socketIO,
        updateCampaignJournalPostService,
    }: CampaignCoreDependencies['updateCampaignJournalPostOperationContract']) {
        this.updateCampaignJournalPostService = updateCampaignJournalPostService;
        this.socketIO = socketIO;
        this.logger = logger;
    }

    public async execute(payload: UpdateCampaignJournalPostPayload): Promise<CampaignJournalPost> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);

        const { campaign, updatedPost } = await this.updateCampaignJournalPostService.updatePost(payload);
        const savedCampaign = await this.updateCampaignJournalPostService.save(campaign);
        const savedPost = savedCampaign.infos.journal.find(
            (journalPost) => (journalPost as CampaignJournalPost).postId === updatedPost.postId
        ) as CampaignJournalPost;

        this.socketIO.syncActiveCampaign(savedCampaign);
        this.socketIO.emitToCampaign(payload.campaignId, 'journal:post_updated', {
            campaignId: payload.campaignId,
            post: savedPost,
        });

        return savedPost;
    }
}
