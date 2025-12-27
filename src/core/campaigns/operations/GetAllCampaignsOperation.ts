import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import CampaignsDependencies from 'src/types/modules/core/campaigns/CampaignsDependencies';

export default class GetAllCampaignsOperation {
    private readonly getAllCampaignsService;
    private readonly logger;

    constructor({ getAllCampaignsService, logger }: CampaignsDependencies['getAllCampaignsOperationContract']) {
        this.getAllCampaignsService = getAllCampaignsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(): Promise<CampaignInstance[]> {
        this.logger('info', 'Execute - GetAllCampaignsOperation');
        return this.getAllCampaignsService.getAll();
    }
}
