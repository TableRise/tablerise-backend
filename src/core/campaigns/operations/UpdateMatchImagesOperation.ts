import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import { TUpdateCampaignMatchImagesBody } from 'src/interface/campaigns/presentation/campaigns/CampaignsSchemas';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateMatchImagesOperation {
    private readonly updateMatchImagesService;
    private readonly socketIO;
    private readonly logger;

    constructor({
        updateMatchImagesService,
        socketIO,
        logger,
    }: CampaignCoreDependencies['updateMatchImagesOperationContract']) {
        this.updateMatchImagesService = updateMatchImagesService;
        this.socketIO = socketIO;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: TUpdateCampaignMatchImagesBody & { campaignId: string }): Promise<ImageObject[]> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);

        const campaignUpdated = await this.updateMatchImagesService.updateMatchImages(payload);
        const savedCampaign = await this.updateMatchImagesService.save(campaignUpdated);

        this.socketIO.syncActiveCampaign(savedCampaign);
        this.socketIO.emitToCampaign(payload.campaignId, 'campaign:images_updated', {
            campaignId: payload.campaignId,
            images: savedCampaign.matchData.images,
        });

        return savedCampaign.matchData.images;
    }
}
