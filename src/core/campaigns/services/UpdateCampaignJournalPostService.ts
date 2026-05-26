import Campaign, { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { CampaignJournalPost, UpdateCampaignJournalPostPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

const CATEGORIES_ALLOWED_FOR_PLAYER = ['players', 'characters-players'];
const CATEGORIES_ALLOWED_FOR_MASTER = ['master', 'characters-master', 'environment', 'world-news', 'announcements'];
const CATEGORIES_ALLOWED_FOR_ADMIN = [
    'admin',
    'players',
    'characters-players',
    'environment',
    'world-news',
    'announcements',
];

const getHighlightedJournalPostId = (highlightedJournal: Campaign['infos']['highlightedJournal']): string | null => {
    if (typeof highlightedJournal !== 'object' || highlightedJournal === null) return null;

    const highlightedPostId = (highlightedJournal as unknown as Record<string, unknown>).postId;
    return typeof highlightedPostId === 'string' ? highlightedPostId : null;
};

export default class UpdateCampaignJournalPostService {
    private readonly campaignsRepository;
    private readonly logger;

    constructor({ campaignsRepository, logger }: CampaignCoreDependencies['updateCampaignJournalPostServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    public async updatePost(
        payload: UpdateCampaignJournalPostPayload
    ): Promise<{ campaign: Campaign; updatedPost: CampaignJournalPost }> {
        this.logger('info', 'Execute - UpdateCampaignJournalPostService');

        const { campaignId, callerId, userId, postId, title, post, category } = payload;
        const campaign = await this.campaignsRepository.findOne({ campaignId });
        const caller = campaign.campaignPlayers.find((player: Player) => player.userId === callerId);
        const postIndex = campaign.infos.journal.findIndex(
            (journalPost) => (journalPost as CampaignJournalPost).postId === postId
        );

        if (!caller) HttpRequestErrors.throwError('campaign-player-not-exists');
        if (postIndex === -1) HttpRequestErrors.throwError('journal-post-inexistent');

        const targetPost = campaign.infos.journal[postIndex] as CampaignJournalPost;

        if (targetPost.author.userId !== userId) HttpRequestErrors.throwError('journal-post-inexistent');
        if (caller.userId !== targetPost.author.userId) HttpRequestErrors.throwError('forbidden-role-operation');
        if (caller.role === 'player' && !CATEGORIES_ALLOWED_FOR_PLAYER.includes(category))
            HttpRequestErrors.throwError('forbidden-post-category');
        if (caller.role === 'dungeon_master' && !CATEGORIES_ALLOWED_FOR_MASTER.includes(category))
            HttpRequestErrors.throwError('forbidden-post-category');
        if (caller.role === 'admin_player' && !CATEGORIES_ALLOWED_FOR_ADMIN.includes(category))
            HttpRequestErrors.throwError('forbidden-post-category');

        targetPost.title = title;
        targetPost.content = post;
        targetPost.category = category;

        campaign.infos.journal[postIndex] = targetPost;

        if (getHighlightedJournalPostId(campaign.infos.highlightedJournal) === postId) {
            (campaign.infos.highlightedJournal as CampaignJournalPost).title = title;
            (campaign.infos.highlightedJournal as CampaignJournalPost).content = post;
            (campaign.infos.highlightedJournal as CampaignJournalPost).category = category;
        }

        return { campaign, updatedPost: targetPost };
    }

    public async save(campaign: Campaign): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.save.name}`;
        this.logger('info', callName);
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
