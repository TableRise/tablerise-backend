import { TUpdateCampaignBody } from 'src/interface/campaigns/presentation/campaigns/CampaignsSchemas';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import {
    addXp,
    finalizeProgression,
    snapshotProgression,
    USER_XP_EVENTS,
} from 'src/domains/users/helpers/UserProgression';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';

export default class UpdateCampaignService {
    private readonly campaignsRepository;
    private readonly usersDetailsRepository;
    private readonly logger;

    constructor({
        campaignsRepository,
        usersDetailsRepository,
        logger,
    }: CampaignCoreDependencies['updateCampaignServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;

        this.update = this.update.bind(this);
    }

    public async update({
        campaignId,
        title,
        description,
        mainHistory,
        visibility,
        ageRestriction,
        nextMatchDate,
        nextSessionResume,
        playerAmountLimit,
        configurations,
        socialMedia,
        adminId,
    }: TUpdateCampaignBody & { campaignId: string }): Promise<Campaign> {
        this.logger('info', 'Update - UpdateCampaignService');
        const campaignInDb = await this.campaignsRepository.findOne({ campaignId });
        const previousAdminId = campaignInDb.campaignPlayers.find((player) => player.role === 'admin_player')?.userId;

        campaignInDb.title = title ?? campaignInDb.title;
        campaignInDb.description = description ?? campaignInDb.description;
        campaignInDb.mainHistory = mainHistory ?? campaignInDb.mainHistory;
        campaignInDb.ageRestriction = ageRestriction ?? campaignInDb.ageRestriction;
        campaignInDb.infos.visibility = (visibility as 'hidden' | 'visible') ?? campaignInDb.infos.visibility;
        campaignInDb.infos.nextMatchDate = nextMatchDate ?? campaignInDb.infos.nextMatchDate;
        campaignInDb.infos.playerAmountLimit = playerAmountLimit ?? campaignInDb.infos.playerAmountLimit;
        if (campaignInDb.matchData) {
            campaignInDb.matchData.nextSessionResume = nextSessionResume ?? campaignInDb.matchData.nextSessionResume;
        }
        if (!campaignInDb.infos.socialMedia) campaignInDb.infos.socialMedia = {};
        if (!Array.isArray(campaignInDb.infos.adminXpGrantedUserIds)) campaignInDb.infos.adminXpGrantedUserIds = [];

        campaignInDb.infos.socialMedia = { ...campaignInDb.infos.socialMedia, ...socialMedia };
        campaignInDb.configurations = { ...campaignInDb.configurations, ...configurations };

        if (adminId !== undefined) {
            if (adminId === 'none') {
                campaignInDb.campaignPlayers = campaignInDb.campaignPlayers.map((player) => {
                    if (player.role !== 'dungeon_master') return { ...player, role: 'player' as const };
                    return player;
                });
            } else {
                campaignInDb.campaignPlayers = campaignInDb.campaignPlayers.map((player) => {
                    if (player.userId === adminId) return { ...player, role: 'admin_player' as const };
                    if (player.role === 'admin_player') return { ...player, role: 'player' as const };
                    return player;
                });

                const promotedPlayer = campaignInDb.campaignPlayers.find((player) => player.userId === adminId);
                const shouldGrantAdminXp =
                    promotedPlayer?.role === 'admin_player' &&
                    previousAdminId !== adminId &&
                    !campaignInDb.infos.adminXpGrantedUserIds.includes(adminId);

                if (shouldGrantAdminXp) {
                    const promotedUserDetails = await this.usersDetailsRepository.findOne({ userId: adminId });
                    if (!promotedUserDetails) HttpRequestErrors.throwError('user-inexistent');

                    const progressionSnapshot = snapshotProgression(promotedUserDetails);
                    addXp(promotedUserDetails, USER_XP_EVENTS.CAMPAIGN_ADMIN_GRANT);
                    finalizeProgression(promotedUserDetails, progressionSnapshot);

                    await this.usersDetailsRepository.update({
                        query: { userDetailId: promotedUserDetails.userDetailId },
                        payload: promotedUserDetails,
                    });

                    campaignInDb.infos.adminXpGrantedUserIds.push(adminId);
                }
            }
        }

        return campaignInDb;
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
