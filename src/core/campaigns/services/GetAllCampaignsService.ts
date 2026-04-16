import { GetAllCampaignsResponse } from 'src/types/api/campaigns/http/response';
import CampaignsDependencies from 'src/types/modules/core/campaigns/CampaignsDependencies';
import { GetAllCampaignsQuery } from 'src/types/api/campaigns/http/payload';

export default class GetAllCampaignsService {
    private readonly campaignsRepository;
    private readonly logger;

    constructor({ campaignsRepository, logger }: CampaignsDependencies['getAllCampaignsServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    async getAll({ title, code }: GetAllCampaignsQuery = {}): Promise<GetAllCampaignsResponse[]> {
        this.logger('info', 'GetAll - GetAllCampaignsService');

        const dbQuery: Record<string, any> = { 'infos.visibility': 'visible' };

        if (title) {
            dbQuery.title = { $regex: title, $options: 'i' };
        }

        if (code) {
            dbQuery.code = code;
        }

        const campaignsInDb = await this.campaignsRepository.find(dbQuery);

        return campaignsInDb.map(
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
