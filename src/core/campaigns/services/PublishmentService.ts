import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { publishmentPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class PublishmentService {
    private readonly campaignsRepository;
    private readonly usersRepository;
    private readonly logger;

    constructor({
        campaignsRepository,
        usersRepository,
        logger,
    }: CampaignCoreDependencies['publishmentServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.usersRepository = usersRepository;
        this.logger = logger;
    }

    async addPost({ campaignId, userId, payload }: publishmentPayload): Promise<CampaignInstance> {
        this.logger('info', 'Execute - publishmentService');
        const campaignInDb = await this.campaignsRepository.findOne({ campaignId });
        const userInDb = await this.usersRepository.findOne({ userId });

        campaignInDb.infos.announcements.push({
            title: payload.title,
            content: payload.content,
            author: userInDb.nickname,
        });

        return campaignInDb;
    }

    async save(campaign: CampaignInstance): Promise<CampaignInstance> {
        this.logger('info', 'Save - publishmentService');
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
