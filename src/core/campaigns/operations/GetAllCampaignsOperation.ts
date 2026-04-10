import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import CampaignsDependencies from 'src/types/modules/core/campaigns/CampaignsDependencies';

export default class GetAllCampaignsOperation {
    private readonly getAllCampaignsService;
    private readonly logger;

    constructor({ getAllCampaignsService, logger }: CampaignsDependencies['getAllCampaignsOperationContract']) {
        this.getAllCampaignsService = getAllCampaignsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(): Promise<Campaign[]> {
        this.logger('info', 'Execute - GetAllCampaignsOperation');
        return this.getAllCampaignsService.getAll();
    }
}
