import { TUpdateCampaignBody } from 'src/interface/campaigns/presentation/campaigns/CampaignsSchemas';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateCampaignService {
    private readonly campaignsRepository;
    private readonly logger;

    constructor({ campaignsRepository, logger }: CampaignCoreDependencies['updateCampaignServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;

        this.update = this.update.bind(this);
    }

    async update({
        campaignId,
        title,
        description,
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

        campaignInDb.title = title ?? campaignInDb.title;
        campaignInDb.description = description ?? campaignInDb.description;
        campaignInDb.ageRestriction = ageRestriction ?? campaignInDb.ageRestriction;
        campaignInDb.infos.visibility = (visibility as 'hidden' | 'visible') ?? campaignInDb.infos.visibility;
        campaignInDb.infos.nextMatchDate = nextMatchDate ?? campaignInDb.infos.nextMatchDate;
        campaignInDb.infos.playerAmountLimit = playerAmountLimit ?? campaignInDb.infos.playerAmountLimit;
        if (campaignInDb.matchData)
            campaignInDb.matchData.nextSessionResume = nextSessionResume ?? campaignInDb.matchData.nextSessionResume;
        if (!campaignInDb.infos.socialMedia) campaignInDb.infos.socialMedia = {};

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
                    if (player.role === 'admin_player') return { ...player, role: 'player' as const };
                    if (player.userId === adminId) return { ...player, role: 'admin_player' as const };
                    return player;
                });
            }
        }

        return campaignInDb;
    }

    async save(campaign: Campaign): Promise<Campaign> {
        this.logger('info', 'Save - UpdateCampaignService');
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
