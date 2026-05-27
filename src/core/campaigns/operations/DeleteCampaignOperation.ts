import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';

export default class DeleteCampaignOperation {
    private readonly deleteCampaignService;
    private readonly logger;

    constructor({ deleteCampaignService, logger }: CampaignCoreDependencies['deleteCampaignOperationContract']) {
        this.deleteCampaignService = deleteCampaignService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(campaignId: string, userId: string): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        return await this.deleteCampaignService.deleteCampaign(campaignId, userId);
    }
}
