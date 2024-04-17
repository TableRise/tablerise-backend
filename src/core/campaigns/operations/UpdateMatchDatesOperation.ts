import { UpdateMatchDatesPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateMatchDatesOperation {
    private readonly _updateMatchDatesService;
    private readonly _logger;

    constructor({
        updateMatchDatesService,
        logger,
    }: CampaignCoreDependencies['updateMatchDatesOperationContract']) {
        this._updateMatchDatesService = updateMatchDatesService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: UpdateMatchDatesPayload): Promise<string[]> {
        this._logger('info', 'Execute - UpdateMatchDatesOperation');

        const campaignWithOperationDone =
            await this._updateMatchDatesService.updateMatchDates(payload);
        const savedCampaign = await this._updateMatchDatesService.save(
            campaignWithOperationDone
        );

        return savedCampaign.infos.matchDates;
    }
}
