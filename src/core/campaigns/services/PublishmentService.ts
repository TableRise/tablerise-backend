import Campaign, { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import newUUID from 'src/domains/common/helpers/newUUID';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { CampaignJournalPost, publishmentPayload } from 'src/types/api/campaigns/http/payload';
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

export default class PublishmentService {
    private readonly campaignsRepository;
    private readonly logger;

    constructor({ campaignsRepository, logger }: CampaignCoreDependencies['publishmentServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    async addPost({ campaignId, userId, payload }: publishmentPayload): Promise<Campaign> {
        this.logger('info', 'Execute - publishmentService');
        const campaignInDb = await this.campaignsRepository.findOne({ campaignId });

        const playerInCampaign = campaignInDb.campaignPlayers.find((p) => p.userId === userId) as Player;

        if (playerInCampaign.role === 'player' && !CATEGORIES_ALLOWED_FOR_PLAYER.includes(payload.category))
            HttpRequestErrors.throwError('forbidden-post-category');
        if (playerInCampaign.role === 'dungeon_master' && !CATEGORIES_ALLOWED_FOR_MASTER.includes(payload.category))
            HttpRequestErrors.throwError('forbidden-post-category');
        if (playerInCampaign.role === 'admin_player' && !CATEGORIES_ALLOWED_FOR_ADMIN.includes(payload.category))
            HttpRequestErrors.throwError('forbidden-post-category');

        (campaignInDb.infos.journal as CampaignJournalPost[]).push({
            postId: newUUID(),
            title: payload.title,
            content: payload.content,
            author: campaignInDb.campaignPlayers.find((p) => p.userId === userId) as Player,
            timestamp: new Date().toISOString(),
            category: payload.category,
        } as CampaignJournalPost);

        return campaignInDb;
    }

    async save(campaign: Campaign): Promise<Campaign> {
        this.logger('info', 'Save - publishmentService');
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
