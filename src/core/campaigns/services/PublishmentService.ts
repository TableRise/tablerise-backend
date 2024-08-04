import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { publishmentPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class PublishmentService {
    private readonly _campaignsRepository;
    private readonly _usersRepository;
    private readonly _logger;

    constructor({
        campaignsRepository,
        usersRepository,
        logger,
    }: CampaignCoreDependencies['publishmentServiceContract']) {
        this._campaignsRepository = campaignsRepository;
        this._usersRepository = usersRepository;
        this._logger = logger;
    }

    async addPost({
        campaignId,
        userId,
        payload,
    }: publishmentPayload): Promise<CampaignInstance> {
        this._logger('info', 'Execute - publishmentService');
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
        this._logger('info', 'Save - publishmentService');
        return this._campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
