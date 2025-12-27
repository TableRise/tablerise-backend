import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { PostBanPlayerPayload } from 'src/types/api/campaigns/http/payload';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import { GameInfoCampaigns } from '@tablerise/database-management/dist/src/interfaces/User';

export default class PostBanPlayerService {
    private readonly _logger;
    private readonly _usersDetailsRepository;
    private readonly _campaignsRepository;

    constructor({
        usersDetailsRepository,
        campaignsRepository,
        logger,
    }: CampaignCoreDependencies['postBanPlayerServiceContract']) {
        this._usersDetailsRepository = usersDetailsRepository;
        this._campaignsRepository = campaignsRepository;
        this._logger = logger;
    }

    private validateBanPlayer(campaign: CampaignInstance, playerId: string): void {
        this._logger('info', 'validateBanPlayer - PostBanPlayerService');

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
        campaign: CampaignInstance,
        playerId: string,
        campaignId: string,
        userDetailInDb: UserDetail
    ): void {
        this._logger('info', 'updateCampaignAndUser - PostBanPlayerService');

        const playerIndex = campaign.campaignPlayers.findIndex((data: Player) => data.userId === playerId);

        campaign.campaignPlayers[playerIndex].status = 'banned';

        userDetailInDb.gameInfo.campaigns = userDetailInDb.gameInfo.campaigns.filter(
            (data: GameInfoCampaigns) => data.campaignId !== campaignId
        );
    }

    private async saveUpdates(campaign: CampaignInstance, userDetailInDb: UserDetail): Promise<void> {
        this._logger('info', 'saveUpdates - PostBanPlayerService');

        await this._campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });

        await this._usersDetailsRepository.update({
            query: { userDetailId: userDetailInDb.userDetailId },
            payload: userDetailInDb,
        });
    }

    public async banPlayer({ campaignId, playerId }: PostBanPlayerPayload): Promise<void> {
        this._logger('info', 'banPlayer - PostBanPlayerService');

        const campaign = await this._campaignsRepository.findOne({ campaignId });

        this.validateBanPlayer(campaign, playerId);

        const userDetailInDb = await this._usersDetailsRepository.findOne({
            userId: playerId,
        });

        this.updateInformation(campaign, playerId, campaignId, userDetailInDb);

        await this.saveUpdates(campaign, userDetailInDb);
    }
}
