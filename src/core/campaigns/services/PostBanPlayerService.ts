import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { PostBanPlayerPayload } from 'src/types/api/campaigns/http/payload';

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

    public async banPlayer({
        campaignId,
        playerId,
    }: PostBanPlayerPayload): Promise<void> {
        this._logger('info', 'banPlayer - PostBanPlayerService');

        const campaign = await this._campaignsRepository.findOne({ campaignId });

        const isbanned = campaign.bannedPlayers.some((data: string) => data === playerId);

        if (isbanned) {
            HttpRequestErrors.throwError('player-already-banned');
        }

        const playerInCampaign = campaign.campaignPlayers.find(
            (player: { userId: string }) => player.userId === playerId
        );

        if (!playerInCampaign) {
            HttpRequestErrors.throwError('player-not-in-match');
        }

        if (playerInCampaign.role === 'dungeon_master') {
            HttpRequestErrors.throwError('player-is-the-dungeon-master');
        }

        campaign.campaignPlayers = campaign.campaignPlayers.filter(
            (player: { userId: string }) => player.userId !== playerId
        );

        campaign.bannedPlayers.push(playerId);

        await this._campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });

        const userDetailInDb = await this._usersDetailsRepository.findOne({
            userId: playerId,
        });

        userDetailInDb.gameInfo.bannedFromCampaigns.push(campaignId);

        await this._usersDetailsRepository.update({
            query: { userDetailId: userDetailInDb.userDetailId },
            payload: userDetailInDb,
        });
    }
}
