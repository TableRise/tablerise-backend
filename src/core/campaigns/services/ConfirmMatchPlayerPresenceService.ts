import { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class ConfirmMatchPlayerPresenceService {
    private readonly campaignsRepository;
    private readonly logger;

    constructor({
        logger,
        campaignsRepository,
    }: CampaignCoreDependencies['confirmMatchPlayerPresenceServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    async confirmPresence(campaignId: string, userId: string, cancel: boolean): Promise<void> {
        this.logger('info', 'Execute - ConfirmMatchPlayerPresenceService');

        const campaignInDb = await this.campaignsRepository.findOne({ campaignId });
        const userInCampaign = campaignInDb.campaignPlayers.find((pc) => pc.userId === userId);

        if (cancel) {
            const confirmedPlayersWithoutUser = campaignInDb.matchData.confirmedPlayers.filter(
                (pc) => pc.userId !== userId
            );
            campaignInDb.matchData.confirmedPlayers = confirmedPlayersWithoutUser;
        } else {
            campaignInDb.matchData.confirmedPlayers.push(userInCampaign as Player);
        }

        await this.campaignsRepository.update({
            query: { campaignId },
            payload: campaignInDb,
        });
    }
}
