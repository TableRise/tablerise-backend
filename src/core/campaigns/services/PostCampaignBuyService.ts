import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { PostCampaignBuyPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { incrementGameInfoCounter } from 'src/domains/users/helpers/GameInfoCounters';
import { awardCampaignBadges } from 'src/domains/users/helpers/BadgeAwardHandler';

export default class PostCampaignBuyService {
    private readonly campaignsRepository;
    private readonly usersDetailsRepository;
    private readonly logger;

    constructor({
        campaignsRepository,
        usersDetailsRepository,
        logger,
    }: CampaignCoreDependencies['postCampaignBuyServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;
    }

    public async createBuy({ campaignId, userId, payload }: PostCampaignBuyPayload): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.createBuy.name}`;
        this.logger('info', callName);

        const campaign = await this.campaignsRepository.findOne({ campaignId });
        const caller = campaign.campaignPlayers.find((player) => player.userId === userId);

        if (!caller) {
            HttpRequestErrors.throwError('campaign-player-not-exists');
        }

        campaign.buys = campaign.buys ?? [];
        campaign.buys.push(payload);

        const userDetails = await this.usersDetailsRepository.findOne({ userId });
        if (!userDetails) HttpRequestErrors.throwError('user-inexistent');

        incrementGameInfoCounter(userDetails, 'equipBoughtAmount');
        awardCampaignBadges(userDetails);

        await this.usersDetailsRepository.update({
            query: { userDetailId: userDetails.userDetailId },
            payload: userDetails,
        });

        return this.campaignsRepository.updateBuys(campaignId, campaign.buys);
    }
}
