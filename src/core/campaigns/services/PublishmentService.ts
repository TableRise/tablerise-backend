import Campaign, { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import newUUID from 'src/domains/common/helpers/newUUID';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { CampaignJournalPost, publishmentPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import {
    addXp,
    finalizeProgression,
    snapshotProgression,
    USER_XP_EVENTS,
} from 'src/domains/users/helpers/UserProgression';

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
    private readonly usersDetailsRepository;
    private readonly logger;

    constructor({
        campaignsRepository,
        usersDetailsRepository,
        logger,
    }: CampaignCoreDependencies['publishmentServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;
    }

    async addPost({ campaignId, userId, payload }: publishmentPayload): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.addPost.name}`;
        this.logger('info', callName);
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

    async save(campaign: Campaign, userId: string): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.save.name}`;
        this.logger('info', callName);
        const savedCampaign = await this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });

        const userDetails = await this.usersDetailsRepository.findOne({ userId });
        if (!userDetails) HttpRequestErrors.throwError('user-inexistent');

        const progressionSnapshot = snapshotProgression(userDetails);
        addXp(userDetails, USER_XP_EVENTS.CAMPAIGN_JOURNAL_POST);
        finalizeProgression(userDetails, progressionSnapshot);

        await this.usersDetailsRepository.update({
            query: { userDetailId: userDetails.userDetailId },
            payload: userDetails,
        });

        return savedCampaign;
    }
}
