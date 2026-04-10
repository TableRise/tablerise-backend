import { Music } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { UpdateMatchMusicsPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateMatchMusicsOperation {
    private readonly updateMatchMusicsService;
    private readonly logger;

    constructor({ updateMatchMusicsService, logger }: CampaignCoreDependencies['updateMatchMusicsOperationContract']) {
        this.updateMatchMusicsService = updateMatchMusicsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: UpdateMatchMusicsPayload): Promise<Music[]> {
        this.logger('info', 'Execute - UpdateMatchMusicsOperation');

        const campaignWithOperationDone = await this.updateMatchMusicsService.updateMatchMusics(payload);
        const savedCampaign = await this.updateMatchMusicsService.save(campaignWithOperationDone);

        return savedCampaign.matchData.musics;
    }
}
