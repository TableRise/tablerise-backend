import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { PostBanPlayerPayload } from 'src/types/api/campaigns/http/payload';
import Campaign, { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { UserDetail, GameInfoCampaigns } from '@tablerise/database-management/dist/src/interfaces/User';

export default class PostBanPlayerService {
    private readonly logger;
    private readonly usersDetailsRepository;
    private readonly campaignsRepository;

    constructor({
        usersDetailsRepository,
        campaignsRepository,
        logger,
    }: CampaignCoreDependencies['postBanPlayerServiceContract']) {
        this.usersDetailsRepository = usersDetailsRepository;
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    private validateBanPlayer(campaign: Campaign, playerId: string): void {
        this.logger('info', 'validateBanPlayer - PostBanPlayerService');

        const playerInCampaign = campaign.campaignPlayers.find(
            (player: { userId: string }) => player.userId === playerId
        );

        if (!playerInCampaign) {
            HttpRequestErrors.throwError('player-not-in-match');
        }

        if (playerInCampaign.role === 'dungeon_master') {
            HttpRequestErrors.throwError('player-is-the-dungeon-master');
        }

        const isBanned = campaign.campaignPlayers.some((data: Player) => data.status === 'banned');

        if (isBanned) {
            HttpRequestErrors.throwError('player-already-banned');
        }
    }

    private updateInformation(
        campaign: Campaign,
        playerId: string,
        campaignId: string,
        userDetailInDb: UserDetail
    ): void {
        this.logger('info', 'updateCampaignAndUser - PostBanPlayerService');

        const playerIndex = campaign.campaignPlayers.findIndex((data: Player) => data.userId === playerId);

        campaign.campaignPlayers[playerIndex].status = 'banned';

        userDetailInDb.gameInfo.campaigns = userDetailInDb.gameInfo.campaigns.filter(
            (data: GameInfoCampaigns) => data.campaignId !== campaignId
        );
    }

    private async saveUpdates(campaign: Campaign, userDetailInDb: UserDetail): Promise<void> {
        this.logger('info', 'saveUpdates - PostBanPlayerService');

        await this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });

        await this.usersDetailsRepository.update({
            query: { userDetailId: userDetailInDb.userDetailId },
            payload: userDetailInDb,
        });
    }

    public async banPlayer({ campaignId, playerId }: PostBanPlayerPayload): Promise<void> {
        this.logger('info', 'banPlayer - PostBanPlayerService');

        const campaign = await this.campaignsRepository.findOne({ campaignId });

        this.validateBanPlayer(campaign, playerId);

        const userDetailInDb = await this.usersDetailsRepository.findOne({
            userId: playerId,
        });

        this.updateInformation(campaign, playerId, campaignId, userDetailInDb);

        await this.saveUpdates(campaign, userDetailInDb);
    }
}
