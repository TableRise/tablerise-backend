import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { PostBanPlayerPayload } from 'src/types/api/campaigns/http/payload';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
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

    private _validateBanPlayer(campaign: CampaignInstance, playerId: string): void {
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

        const isBanned = campaign.campaignPlayers.some(
            (data: Player) => data.status === 'banned'
        );

        if (isBanned) {
            HttpRequestErrors.throwError('player-already-banned');
        }
    }

    private _updateInformation(
        campaign: CampaignInstance,
        playerId: string,
        campaignId: string,
        userDetailInDb: UserDetailInstance
    ): void {
        this._logger('info', 'updateCampaignAndUser - PostBanPlayerService');

        const playerIndex = campaign.campaignPlayers.findIndex(
            (data: Player) => data.userId === playerId
        );

        campaign.campaignPlayers[playerIndex].status = 'banned';

        userDetailInDb.gameInfo.campaigns = userDetailInDb.gameInfo.campaigns.filter(
            (data: GameInfoCampaigns) => data.campaignId !== campaignId
        );
    }

    private async _saveUpdates(
        campaign: CampaignInstance,
        userDetailInDb: UserDetailInstance
    ): Promise<void> {
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

    public async banPlayer({
        campaignId,
        playerId,
    }: PostBanPlayerPayload): Promise<void> {
        this._logger('info', 'banPlayer - PostBanPlayerService');

        const campaign = await this._campaignsRepository.findOne({ campaignId });

        this._validateBanPlayer(campaign, playerId);

        const userDetailInDb = await this._usersDetailsRepository.findOne({
            userId: playerId,
        });

        this._updateInformation(campaign, playerId, campaignId, userDetailInDb);

        await this._saveUpdates(campaign, userDetailInDb);
    }
}
