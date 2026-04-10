import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import { TUpdateCampaignMatchMapImagesBody } from 'src/interface/campaigns/presentation/campaigns/CampaignsSchemas';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateMatchMapImagesOperation {
    private readonly updateMatchMapImagesService;
    private readonly logger;

    constructor({
        updateMatchMapImagesService,
        logger,
    }: CampaignCoreDependencies['updateMatchMapImagesOperationContract']) {
        this.updateMatchMapImagesService = updateMatchMapImagesService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: TUpdateCampaignMatchMapImagesBody & { campaignId: string }): Promise<ImageObject[]> {
        this.logger('info', 'Execute - UpdateMatchMapImagesOperation');

        const campaignWithOperationDone = await this.updateMatchMapImagesService.updateMatchMapImage(payload);
        const savedCampaign = await this.updateMatchMapImagesService.save(campaignWithOperationDone);

        return savedCampaign.matchData.mapImages;
    }
}
