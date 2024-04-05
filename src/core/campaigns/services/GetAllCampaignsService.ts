import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import CampaignsDependencies from 'src/types/modules/core/campaigns/CampaignsDependencies';

export default class GetAllCampaignsService {
    private readonly _campaignsRepository;
    private readonly _logger;

    constructor({
        campaignsRepository,
        logger,
    }: CampaignsDependencies['getAllCampaignsServiceContract']) {
        this._campaignsRepository = campaignsRepository;
        this._logger = logger;
    }

    async getAll(): Promise <CampaignInstance[]> {
        this._logger('info', 'GetAll - GetAllCampaignsService');
        const campaignsInDb = this._campaignsRepository.find();
        return campaignsInDb;
    }
}
