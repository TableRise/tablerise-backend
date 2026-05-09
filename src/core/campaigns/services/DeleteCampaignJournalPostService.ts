import Campaign, { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { CampaignJournalPost, DeleteCampaignJournalPostPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

const ROLES_ALLOWED_TO_DELETE = ['dungeon_master', 'admin_player'];

const getHighlightedJournalPostId = (highlightedJournal: Campaign['infos']['highlightedJournal']): string | null => {
    if (typeof highlightedJournal !== 'object' || highlightedJournal === null) return null;

    const highlightedPostId = (highlightedJournal as Record<string, unknown>).postId;
    return typeof highlightedPostId === 'string' ? highlightedPostId : null;
};

export default class DeleteCampaignJournalPostService {
    private readonly campaignsRepository;
    private readonly logger;

    constructor({ campaignsRepository, logger }: CampaignCoreDependencies['deleteCampaignJournalPostServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    public async deletePost(
        payload: DeleteCampaignJournalPostPayload
    ): Promise<{ campaign: Campaign; deletedPost: CampaignJournalPost }> {
        this.logger('info', 'Execute - DeleteCampaignJournalPostService');

        const { campaignId, callerId, userId, postId } = payload;
        const campaign = await this.campaignsRepository.findOne({ campaignId });
        const caller = campaign.campaignPlayers.find((player: Player) => player.userId === callerId);
        const postIndex = campaign.infos.journal.findIndex(
            (journalPost) => (journalPost as CampaignJournalPost).postId === postId
        );

        if (!caller) HttpRequestErrors.throwError('campaign-player-not-exists');
        if (postIndex === -1) HttpRequestErrors.throwError('journal-post-inexistent');

        const deletedPost = campaign.infos.journal[postIndex] as CampaignJournalPost;

        if (deletedPost.author.userId !== userId) HttpRequestErrors.throwError('journal-post-inexistent');

        const canDelete = ROLES_ALLOWED_TO_DELETE.includes(caller.role) || caller.userId === deletedPost.author.userId;

        if (!canDelete) HttpRequestErrors.throwError('forbidden-role-operation');

        campaign.infos.journal.splice(postIndex, 1);

        if (getHighlightedJournalPostId(campaign.infos.highlightedJournal) === postId) {
            campaign.infos.highlightedJournal = {} as Campaign['infos']['highlightedJournal'];
        }

        return { campaign, deletedPost };
    }

    public async save(campaign: Campaign): Promise<Campaign> {
        this.logger('info', 'Save - DeleteCampaignJournalPostService');
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
