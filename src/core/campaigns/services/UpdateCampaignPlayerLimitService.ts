import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateCampaignPlayerLimitService {
    private readonly logger;
    private readonly campaignsRepository;

    constructor({ logger, campaignsRepository }: CampaignCoreDependencies['updateCampaignPlayerLimitServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    async updatePlayerLimit(campaignId: string, newLimit: number): Promise<void> {
        this.logger('info', 'Execute - updatePlayerLimit');
        const campaignInDb = await this.campaignsRepository.findOne({ campaignId });
        campaignInDb.infos.playerAmountLimit = newLimit;
        await this.campaignsRepository.update({
            query: { campaignId },
            payload: campaignInDb,
        });
    }
}
