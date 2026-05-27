import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import CampaignsDependencies from 'src/types/modules/core/campaigns/CampaignsDependencies';
import { GetAllCampaignsQuery } from 'src/types/api/campaigns/http/payload';

export default class GetAllCampaignsOperation {
    private readonly getAllCampaignsService;
    private readonly logger;

    constructor({ getAllCampaignsService, logger }: CampaignsDependencies['getAllCampaignsOperationContract']) {
        this.getAllCampaignsService = getAllCampaignsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(query: GetAllCampaignsQuery = {}): Promise<Campaign[]> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        return this.getAllCampaignsService.getAll(query);
    }
}
