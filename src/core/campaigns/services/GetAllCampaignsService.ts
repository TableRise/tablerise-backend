import { GetAllCampaignsResponse } from 'src/types/api/campaigns/http/response';
import CampaignsDependencies from 'src/types/modules/core/campaigns/CampaignsDependencies';

export default class GetAllCampaignsService {
    private readonly campaignsRepository;
    private readonly logger;

    constructor({ campaignsRepository, logger }: CampaignsDependencies['getAllCampaignsServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    async getAll(): Promise<GetAllCampaignsResponse[]> {
        this.logger('info', 'GetAll - GetAllCampaignsService');
        const campaignsInDb = await this.campaignsRepository.find({});
        const campaignsVisible = campaignsInDb.filter((campaign) => campaign.infos.visibility === 'visible');

        return campaignsVisible.map(
            (campaign) =>
                ({
                    title: campaign.title,
                    cover: campaign.cover,
                    description: campaign.description,
                    playersAmount: campaign.campaignPlayers.length,
                    ageRestriction: campaign.ageRestriction,
                    updatedAt: campaign.updatedAt,
                }) as GetAllCampaignsResponse
        );
    }
}
