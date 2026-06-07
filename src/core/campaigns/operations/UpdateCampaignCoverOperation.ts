import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { UpdateCampaignCoverPayload } from 'src/types/api/campaigns/http/payload';

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

    async execute({
        campaignId,
        userId,
        picture,
        imageObject,
    }: UpdateCampaignCoverPayload): Promise<Campaign['cover']> {
        this.logger('info', 'Execute - UpdateCampaignCoverOperation');

        const campaignWithNewCover = await this.updateCampaignCoverService.updateCover({
            campaignId,
            userId,
            picture,
            imageObject,
        });
        const savedCampaign = await this.updateCampaignCoverService.save(campaignWithNewCover);

        return savedCampaign.cover;
    }
}
