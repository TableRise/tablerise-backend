import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { TUpdateCampaignBody } from 'src/interface/campaigns/presentation/campaigns/CampaignsSchemas';

export default class UpdateCampaignOperation {
    private readonly updateCampaignService;
    private readonly logger;

    constructor({ updateCampaignService, logger }: CampaignCoreDependencies['updateCampaignOperationContract']) {
        this.updateCampaignService = updateCampaignService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: TUpdateCampaignBody): Promise<Campaign> {
        this.logger('info', 'Execute - UpdateCampaignOperation');
        const campaignUpdated = await this.updateCampaignService.update(payload);
        return this.updateCampaignService.save(campaignUpdated);
    }
}
