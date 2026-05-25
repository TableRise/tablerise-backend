import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { UpdateMatchHighlightedImagePayload } from 'src/types/api/campaigns/http/payload';

export default class UpdateMatchHighlightedImageOperation {
    private readonly updateMatchHighlightedImageService;
    private readonly socketIO;
    private readonly logger;

    constructor({
        updateMatchHighlightedImageService,
        socketIO,
        logger,
    }: CampaignCoreDependencies['updateMatchHighlightedImageOperationContract']) {
        this.updateMatchHighlightedImageService = updateMatchHighlightedImageService;
        this.socketIO = socketIO;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: UpdateMatchHighlightedImagePayload): Promise<ImageObject | null> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);

        const campaignUpdated = await this.updateMatchHighlightedImageService.updateMatchHighlightedImage(payload);
        const savedCampaign = await this.updateMatchHighlightedImageService.save(campaignUpdated);

        this.socketIO.syncActiveCampaign(savedCampaign);
        this.socketIO.emitToCampaign(payload.campaignId, 'match:image_highlighted_changed', {
            campaignId: payload.campaignId,
            imageHighlighted: savedCampaign.matchData.imageHighlighted ?? null,
        });

        return (savedCampaign.matchData.imageHighlighted ?? null) as ImageObject | null;
    }
}
