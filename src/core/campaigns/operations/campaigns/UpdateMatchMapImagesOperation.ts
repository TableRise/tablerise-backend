import { UpdateMatchMapImagesPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateMatchMapImagesOperation {
    private readonly _logger;

    constructor({ logger }: CampaignCoreDependencies['updateMatchMapImagesOperationContract']) {
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute({ campaignId, mapImage, operation }: UpdateMatchMapImagesPayload): Promise<void> {
        this._logger('info', 'Execute - UpdateMatchMapImagesOperation');
        cons
    }
};
