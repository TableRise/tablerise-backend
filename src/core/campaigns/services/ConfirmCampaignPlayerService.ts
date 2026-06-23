import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { incrementGameInfoCounter } from 'src/domains/users/helpers/GameInfoCounters';
import { awardCampaignBadges } from 'src/domains/users/helpers/BadgeAwardHandler';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import {
    addXp,
    finalizeProgression,
    snapshotProgression,
    USER_XP_EVENTS,
} from 'src/domains/users/helpers/UserProgression';

export default class ConfirmCampaignPlayerService {
    private readonly campaignsRepository;
    private readonly usersDetailsRepository;
    private readonly logger;

    constructor({
        logger,
        campaignsRepository,
        usersDetailsRepository,
    }: CampaignCoreDependencies['confirmCampaignPlayerServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;
    }

    private async awardSimpleXp(userId: string, amount: number): Promise<void> {
        try {
            const userDetails = await this.usersDetailsRepository.findOne({ userId });
            if (!userDetails) return;

            const progressionSnapshot = snapshotProgression(userDetails);
            addXp(userDetails, amount);
            finalizeProgression(userDetails, progressionSnapshot);

            await this.usersDetailsRepository.update({
                query: { userDetailId: userDetails.userDetailId },
                payload: userDetails,
            });
        } catch (error) {
            if (error instanceof HttpRequestErrors && error.code === 404) return;
            throw error;
        }
    }

    public async confirm(campaignId: string, userId: string, userToActivate: string): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.confirm.name}`;
        this.logger('info', callName);

        const campaign = await this.campaignsRepository.findOne({ campaignId });

        const caller = campaign.campaignPlayers.find((p: { userId: string }) => p.userId === userId);

        if (!caller || caller.role === 'player') {
            HttpRequestErrors.throwError('forbidden-role-operation');
        }

        const target = campaign.campaignPlayers.find((p: { userId: string }) => p.userId === userToActivate);

        if (!target) HttpRequestErrors.throwError('campaign-player-not-exists');

        if (target.status !== 'active') {
            const userDetails = await this.usersDetailsRepository.findOne({ userId: userToActivate });
            if (userDetails) {
                const progressionSnapshot = snapshotProgression(userDetails);
                incrementGameInfoCounter(userDetails, 'campaignsJoinedAmount');
                awardCampaignBadges(userDetails);
                addXp(userDetails, USER_XP_EVENTS.CAMPAIGN_ENTRY);
                finalizeProgression(userDetails, progressionSnapshot);

                await this.usersDetailsRepository.update({
                    query: { userDetailId: userDetails.userDetailId },
                    payload: userDetails,
                });
            }

            const rewardTargets = new Set<string>();
            const dungeonMasterId = campaign.campaignPlayers.find((player) => player.role === 'dungeon_master')?.userId;

            if (dungeonMasterId) rewardTargets.add(dungeonMasterId);
            rewardTargets.add(userId);

            await Promise.all(
                Array.from(rewardTargets).map((rewardUserId) =>
                    this.awardSimpleXp(rewardUserId, USER_XP_EVENTS.CAMPAIGN_APPROVAL_BONUS)
                )
            );
        }

        target.status = 'active';

        return await this.campaignsRepository.update({
            query: { campaignId },
            payload: campaign,
        });
    }
}
