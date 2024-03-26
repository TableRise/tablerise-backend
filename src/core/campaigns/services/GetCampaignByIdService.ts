import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { GetCampaignByIdPayload } from 'src/types/api/campaigns/http/payload';
import CampaignsDependencies from 'src/types/modules/core/campaigns/CampaignsDependencies';

export default class GetCampaignByIdService {
    private readonly _campaignsRepository;
    private readonly _logger;

    constructor({
        campaignsRepository,
        logger,
    }: CampaignsDependencies['getCampaignByIdServiceContract']) {
        this._campaignsRepository = campaignsRepository;
        this._logger = logger;
    }

    async get({ campaignId }: GetCampaignByIdPayload): Promise<CampaignInstance> {
        this._logger('info', 'Execute - GetCampaignByIdService');
        return this._campaignsRepository.findOne({ campaignId });
    }
}
