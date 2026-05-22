import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateCampaignPlayerLimitService {
    private readonly logger;
    private readonly campaignsRepository;

    constructor({ logger, campaignsRepository }: CampaignCoreDependencies['updateCampaignPlayerLimitServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    async updatePlayerLimit(campaignId: string, newLimit: number) {
        const callName = `[${this.constructor.name}] - ${this.updatePlayerLimit.name}`;
        this.logger('info', callName);
        const campaignInDb = await this.campaignsRepository.findOne({ campaignId });
        campaignInDb.infos.playerAmountLimit = newLimit;
        return await this.campaignsRepository.update({
            query: { campaignId },
            payload: campaignInDb,
        });
    }
}
