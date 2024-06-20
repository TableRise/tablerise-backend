import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import { UpdateMatchMapImagesPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateMatchMapImagesOperation {
    private readonly _updateMatchMapImagesService;
    private readonly _logger;

    constructor({
        updateMatchMapImagesService,
        logger,
    }: CampaignCoreDependencies['updateMatchMapImagesOperationContract']) {
        this._updateMatchMapImagesService = updateMatchMapImagesService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: UpdateMatchMapImagesPayload): Promise<ImageObject[]> {
        this._logger('info', 'Execute - UpdateMatchMapImagesOperation');

        const campaignWithOperationDone =
            await this._updateMatchMapImagesService.updateMatchMapImage(payload);
        const savedCampaign = await this._updateMatchMapImagesService.save(
            campaignWithOperationDone
        );

        return savedCampaign.matchData.mapImages;
    }
}
