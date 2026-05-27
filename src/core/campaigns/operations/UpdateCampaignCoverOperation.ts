import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { FileObject } from 'src/types/shared/file';

export default class UpdateCampaignCoverOperation {
    private readonly updateCampaignCoverService;
    private readonly logger;

    constructor({
        updateCampaignCoverService,
        logger,
    }: CampaignCoreDependencies['updateCampaignCoverOperationContract']) {
        this.updateCampaignCoverService = updateCampaignCoverService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute({ campaignId, picture }: { campaignId: string; picture: FileObject }): Promise<Campaign['cover']> {
        this.logger('info', 'Execute - UpdateCampaignCoverOperation');

        const campaignWithNewCover = await this.updateCampaignCoverService.updateCover({ campaignId, picture });
        const savedCampaign = await this.updateCampaignCoverService.save(campaignWithNewCover);

        return savedCampaign.cover;
    }
}
