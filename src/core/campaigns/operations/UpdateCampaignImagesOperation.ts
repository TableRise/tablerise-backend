import { ImageCampaign } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { UpdateCampaignImagesPayload } from 'src/types/api/campaigns/http/payload';
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

    async execute(payload: UpdateCampaignImagesPayload): Promise<ImageCampaign> {
        this.logger('info', 'Execute - UpdateCampaignImagesOperation');

        const campaignWithOperationDone = await this.updateCampaignImagesService.updateCampaignImage(payload);
        const savedCampaign = await this.updateCampaignImagesService.save(campaignWithOperationDone);

        return savedCampaign.images;
    }
}
