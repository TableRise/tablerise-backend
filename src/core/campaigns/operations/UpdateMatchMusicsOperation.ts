import { Music } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { UpdateMatchMusicsPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateMatchMusicsOperation {
    private readonly _updateMatchMusicsService;
    private readonly _logger;

    constructor({
        updateMatchMusicsService,
        logger,
    }: CampaignCoreDependencies['updateMatchMusicsOperationContract']) {
        this._updateMatchMusicsService = updateMatchMusicsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: UpdateMatchMusicsPayload): Promise<Music[]> {
        this._logger('info', 'Execute - UpdateMatchMusicsOperation');

        const campaignWithOperationDone =
            await this._updateMatchMusicsService.updateMatchMusics(payload);
        const savedCampaign = await this._updateMatchMusicsService.save(
            campaignWithOperationDone
        );

        return savedCampaign.matchData.musics;
    }
}
