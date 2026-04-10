import { ImageCampaign } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { TUpdateCampaignImagesBodySchema } from 'src/interface/campaigns/presentation/campaigns/CampaignsSchemas';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateCampaignImagesOperation {
    private readonly updateCampaignImagesService;
    private readonly logger;

    constructor({
        updateCampaignImagesService,
        logger,
    }: CampaignCoreDependencies['updateCampaignImagesOperationContract']) {
        this.updateCampaignImagesService = updateCampaignImagesService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: TUpdateCampaignImagesBodySchema & { campaignId: string }): Promise<ImageCampaign> {
        this.logger('info', 'Execute - UpdateCampaignImagesOperation');

        const campaignWithOperationDone = await this.updateCampaignImagesService.updateCampaignImage(payload);
        const savedCampaign = await this.updateCampaignImagesService.save(campaignWithOperationDone);

        return savedCampaign.images;
    }
}
