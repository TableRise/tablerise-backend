import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';

export default class UpdateCampaignPlayerLimitService {
    private readonly logger;
    private readonly campaignsRepository;

    constructor({ logger, campaignsRepository }: CampaignCoreDependencies['updateCampaignPlayerLimitServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    public async updatePlayerLimit(campaignId: string, newLimit: number): Promise<Campaign> {
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
