import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { GetCampaignByIdPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class GetCampaignByIdService {
    private readonly _campaignsRepository;
    private readonly _logger;

    constructor({
        campaignsRepository,
        logger,
    }: CampaignCoreDependencies['getCampaignByIdServiceContract']) {
        this._campaignsRepository = campaignsRepository;
        this._logger = logger;
    }

    async get({ campaignId }: GetCampaignByIdPayload): Promise<CampaignInstance> {
        this._logger('info', 'Execute - GetCampaignByIdService');
        return this._campaignsRepository.findOne({ campaignId });
    }
}
