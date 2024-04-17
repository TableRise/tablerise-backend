import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import CampaignsDependencies from 'src/types/modules/core/campaigns/CampaignsDependencies';

export default class GetAllCampaignsOperation {
    private readonly _getAllCampaignsService;
    private readonly _logger;

    constructor({
        getAllCampaignsService,
        logger,
    }: CampaignsDependencies['getAllCampaignsOperationContract']) {
        this._getAllCampaignsService = getAllCampaignsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(): Promise<CampaignInstance[]> {
        this._logger('info', 'Execute - GetAllCampaignsOperation');
        return this._getAllCampaignsService.getAll();
    }
}
