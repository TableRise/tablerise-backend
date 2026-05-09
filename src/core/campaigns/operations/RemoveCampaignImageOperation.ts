import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { RemoveMatchMapImagePayload } from 'src/types/api/campaigns/http/payload';

export default class RemoveCampaignImageOperation {
    private readonly removeCampaignImageService;
    private readonly socketIO;
    private readonly logger;

    constructor({
        removeCampaignImageService,
        socketIO,
        logger,
    }: CampaignCoreDependencies['removeCampaignImageOperationContract']) {
        this.removeCampaignImageService = removeCampaignImageService;
        this.socketIO = socketIO;
        this.logger = logger;

        this.removeCover = this.removeCover.bind(this);
        this.removeMatchMapImage = this.removeMatchMapImage.bind(this);
    }

    async removeCover(campaignId: string): Promise<void> {
        this.logger('info', 'RemoveCover - RemoveCampaignImageOperation');
        const campaignUpdated = await this.removeCampaignImageService.removeCover({ campaignId });
        const savedCampaign = await this.removeCampaignImageService.save(campaignUpdated);
        this.socketIO.syncActiveCampaign(savedCampaign);
    }

    async removeMatchMapImage({ campaignId, imageUrl }: RemoveMatchMapImagePayload): Promise<void> {
        this.logger('info', 'RemoveMatchMapImage - RemoveCampaignImageOperation');
        const campaignUpdated = await this.removeCampaignImageService.removeMatchMapImage({ campaignId, imageUrl });
        const savedCampaign = await this.removeCampaignImageService.save(campaignUpdated);
        this.socketIO.syncActiveCampaign(savedCampaign);
        this.socketIO.emitToCampaign(campaignId, 'campaign:maps_updated', {
            campaignId,
            mapImages: savedCampaign.matchData.mapImages,
        });
    }
}
