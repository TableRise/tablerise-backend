import { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class ConfirmMatchPlayerPresenceService {
    private readonly campaignsRepository;
    private readonly socketIO;
    private readonly logger;

    constructor({
        logger,
        campaignsRepository,
        socketIO,
    }: CampaignCoreDependencies['confirmMatchPlayerPresenceServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.socketIO = socketIO;
        this.logger = logger;
    }

    async confirmPresence(campaignId: string, userId: string, cancel: boolean): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.confirmPresence.name}`;
        this.logger('info', callName);

        const campaignInDb = await this.campaignsRepository.findOne({ campaignId });
        const userInCampaign = campaignInDb.campaignPlayers.find((pc: { userId: string }) => pc.userId === userId);

        if (cancel) {
            const confirmedPlayersWithoutUser = campaignInDb.matchData.confirmedPlayers.filter(
                (pc: { userId: string }) => pc.userId !== userId
            );
            campaignInDb.matchData.confirmedPlayers = confirmedPlayersWithoutUser;
        } else {
            campaignInDb.matchData.confirmedPlayers.push(userInCampaign as Player);
        }

        const savedCampaign = await this.campaignsRepository.update({
            query: { campaignId },
            payload: campaignInDb,
        });

        this.socketIO.syncActiveCampaign(savedCampaign);
        this.socketIO.emitToCampaign(campaignId, 'presence:confirmed_players_updated', {
            campaignId,
            confirmedPlayers: savedCampaign.matchData.confirmedPlayers,
        });
    }
}
