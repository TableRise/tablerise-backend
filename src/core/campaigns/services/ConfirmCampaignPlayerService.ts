import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { incrementGameInfoCounter } from 'src/domains/users/helpers/GameInfoCounters';
import { awardCampaignBadges } from 'src/domains/users/helpers/BadgeAwardHandler';

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

    public async confirm(campaignId: string, userId: string, userToActivate: string) {
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
                incrementGameInfoCounter(userDetails, 'campaignsJoinedAmount');
                awardCampaignBadges(userDetails);

                await this.usersDetailsRepository.update({
                    query: { userDetailId: userDetails.userDetailId },
                    payload: userDetails,
                });
            }
        }

        target.status = 'active';

        return await this.campaignsRepository.update({
            query: { campaignId },
            payload: campaign,
        });
    }
}
