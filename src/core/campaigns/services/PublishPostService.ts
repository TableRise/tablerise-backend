import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { PublishPostPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class PublishPostService {
    private readonly _campaignsRepository;
    private readonly _usersRepository;
    private readonly _logger;

    constructor({
        campaignsRepository,
        usersRepository,
        logger,
    }: CampaignCoreDependencies['publishPostServiceContract']) {
        this._campaignsRepository = campaignsRepository;
        this._usersRepository = usersRepository;
        this._logger = logger;
    }

    async addPost({
        campaignId,
        userId,
        payload,
    }: PublishPostPayload): Promise<CampaignInstance> {
        this._logger('info', 'Execute - PublishPostService');
        const campaignInDb = await this._campaignsRepository.findOne({ campaignId });
        const userInDb = await this._usersRepository.findOne({ userId });

        campaignInDb.infos.announcements.push({
            title: payload.title,
            content: payload.content,
            author: userInDb.nickname,
        });

        return campaignInDb;
    }

    async save(campaign: CampaignInstance): Promise<CampaignInstance> {
        this._logger('info', 'Save - PublishPostService');
        const camapaignUpdated = await this._campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });

        return camapaignUpdated;
    }
}
