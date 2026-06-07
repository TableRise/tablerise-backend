import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import { TUpdateCampaignMatchMapImagesBody } from 'src/interface/campaigns/presentation/campaigns/CampaignsSchemas';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateMatchMapImagesOperation {
    private readonly updateMatchMapImagesService;
    private readonly socketIO;
    private readonly logger;

    constructor({
        updateMatchMapImagesService,
        socketIO,
        logger,
    }: CampaignCoreDependencies['updateMatchMapImagesOperationContract']) {
        this.updateMatchMapImagesService = updateMatchMapImagesService;
        this.socketIO = socketIO;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(
        payload: TUpdateCampaignMatchMapImagesBody & { campaignId: string; userId: string }
    ): Promise<ImageObject[]> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);

        const campaignWithOperationDone = await this.updateMatchMapImagesService.updateMatchMapImage(payload);
        const savedCampaign = await this.updateMatchMapImagesService.save(campaignWithOperationDone);

        this.socketIO.syncActiveCampaign(savedCampaign);
        this.socketIO.emitToCampaign(payload.campaignId, 'campaign:maps_updated', {
            campaignId: payload.campaignId,
            mapImages: savedCampaign.matchData.mapImages,
        });

        return savedCampaign.matchData.mapImages;
    }
}
