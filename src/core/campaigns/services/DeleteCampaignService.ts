import Campaign, { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { incrementGameInfoCounter } from 'src/domains/users/helpers/GameInfoCounters';
import { awardCampaignBadges } from 'src/domains/users/helpers/BadgeAwardHandler';
import {
    addXp,
    finalizeProgression,
    snapshotProgression,
    USER_XP_EVENTS,
} from 'src/domains/users/helpers/UserProgression';

export default class DeleteCampaignService {
    private readonly campaignsRepository;
    private readonly usersDetailsRepository;
    private readonly logger;

    constructor({
        campaignsRepository,
        usersDetailsRepository,
        logger,
    }: CampaignCoreDependencies['deleteCampaignServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;
    }

    private validateCaller(campaign: Campaign, userId: string): void {
        const caller = campaign.campaignPlayers.find((player: Player) => player.userId === userId);

        if (!caller || caller.role !== 'dungeon_master') {
            HttpRequestErrors.throwError('forbidden-role-operation');
        }
    }

    public async deleteCampaign(campaignId: string, userId: string): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.deleteCampaign.name}`;
        this.logger('info', callName);

        const campaign = await this.campaignsRepository.findOne({ campaignId });

        this.validateCaller(campaign, userId);
        campaign.status = 'closed';

        await Promise.all(
            campaign.campaignPlayers.map(async (player: Player) => {
                const userDetails = await this.usersDetailsRepository.findOne({ userId: player.userId });
                if (!userDetails) return;

                const progressionSnapshot = snapshotProgression(userDetails);
                incrementGameInfoCounter(userDetails, 'campaignsClosedAmount');
                addXp(userDetails, USER_XP_EVENTS.CAMPAIGN_COMPLETION);
                awardCampaignBadges(userDetails);
                finalizeProgression(userDetails, progressionSnapshot);

                await this.usersDetailsRepository.update({
                    query: { userDetailId: userDetails.userDetailId },
                    payload: userDetails,
                });
            })
        );

        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
