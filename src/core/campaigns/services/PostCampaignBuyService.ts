import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { PostCampaignBuyPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class PostCampaignBuyService {
    private readonly campaignsRepository;
    private readonly logger;

    constructor({ campaignsRepository, logger }: CampaignCoreDependencies['postCampaignBuyServiceContract']) {
        this.campaignsRepository = campaignsRepository;
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

        return this.campaignsRepository.updateBuys(campaignId, campaign.buys);
    }
}
