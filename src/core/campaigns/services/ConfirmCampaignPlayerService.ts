import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class ConfirmCampaignPlayerService {
    private readonly campaignsRepository;
    private readonly logger;

    constructor({ logger, campaignsRepository }: CampaignCoreDependencies['confirmCampaignPlayerServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    public async confirm(campaignId: string, userId: string, userToActivate: string) {
        const callName = `[${this.constructor.name}] - ${this.confirm.name}`;
        this.logger('info', callName);

        const campaign = await this.campaignsRepository.findOne({ campaignId });

        const caller = campaign.campaignPlayers.find((p: { userId: string }) => p.userId === userId);

        if (!caller || caller.role === 'player') {
            HttpRequestErrors.throwError('forbidden-role-operation');
        }

        const target = campaign.campaignPlayers.find((p: { userId: string }) => p.userId === userToActivate);

        if (!target) HttpRequestErrors.throwError('campaign-player-not-exists');

        target.status = 'active';

        return await this.campaignsRepository.update({
            query: { campaignId },
            payload: campaign,
        });
    }
}
