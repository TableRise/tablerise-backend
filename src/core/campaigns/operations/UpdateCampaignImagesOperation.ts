import { ImageCampaign } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { UpdateCampaignImagesPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateCampaignImagesOperation {
    private readonly _updateCampaignImagesService;
    private readonly _logger;

    constructor({
        updateCampaignImagesService,
        logger,
    }: CampaignCoreDependencies['updateCampaignImagesOperationContract']) {
        this._updateCampaignImagesService = updateCampaignImagesService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: UpdateCampaignImagesPayload): Promise<ImageCampaign> {
        this._logger('info', 'Execute - UpdateCampaignImagesOperation');

        const campaignWithOperationDone =
            await this._updateCampaignImagesService.updateCampaignImage(payload);
        const savedCampaign = await this._updateCampaignImagesService.save(
            campaignWithOperationDone
        );

        return savedCampaign.images;
    }
}
