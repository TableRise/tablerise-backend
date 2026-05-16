import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { PostCampaignLogPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class PostCampaignLogService {
    private readonly campaignsRepository;
    private readonly logger;

    constructor({ campaignsRepository, logger }: CampaignCoreDependencies['postCampaignLogServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    public async createLog({ campaignId, userId, payload }: PostCampaignLogPayload): Promise<Campaign> {
        this.logger('info', 'Execute - PostCampaignLogService');

        const campaign = await this.campaignsRepository.findOne({ campaignId });
        const caller = campaign.campaignPlayers.find((player) => player.userId === userId);

        if (!caller) {
            HttpRequestErrors.throwError('campaign-player-not-exists');
        }

        campaign.matchData.logs = campaign.matchData.logs ?? [];
        campaign.matchData.logs.push({
            loggedAt: payload.loggedAt,
            content: payload.content,
        });

        return this.campaignsRepository.updateMatchLogs(campaignId, campaign.matchData.logs);
    }
}
