import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { UserDetail, GameInfoCampaigns } from '@tablerise/database-management/dist/src/interfaces/User';
import { GetCampaignByUserIdResponse } from 'src/types/api/campaigns/http/response';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class GetCampaignsByUserIdService {
    private readonly campaignsRepository;
    private readonly usersDetailsRepository;
    private readonly logger;

    constructor({
        campaignsRepository,
        usersDetailsRepository,
        logger,
    }: UserCoreDependencies['getCampaignsByUserIdServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;

        this.getByUserId = this.getByUserId.bind(this);
    }

    public async getByUserId(userId: string): Promise<GetCampaignByUserIdResponse> {
        this.logger('info', 'GetByUserId - GetCampaignsByUserIdService');

        const userDetailsInDb = (await this.usersDetailsRepository.findOne({
            userId,
        })) as UserDetail;
        const userCampaignIds = userDetailsInDb.gameInfo.campaigns.map((campaign) => campaign.campaignId);

        if (userCampaignIds.length === 0) HttpRequestErrors.throwError('campaign-player-not-exists');

        const userCampaigns = [] as Campaign[];

        for (const campaignId of userCampaignIds) {
            const campaignFound = await this.campaignsRepository.findOne({ campaignId });
            userCampaigns.push(campaignFound);
        }

        const master = [] as Campaign[];
        const player = [] as Campaign[];

        userDetailsInDb.gameInfo.campaigns.forEach((campaign: GameInfoCampaigns) => {
            const campaignComplete = userCampaigns.find(
                (userCampaign) => userCampaign.campaignId === campaign.campaignId
            );
            const playerInCampaign = campaignComplete?.campaignPlayers.find(
                (currentPlayer) => currentPlayer.userId === userId
            );

            if (!campaignComplete || !playerInCampaign) return;
            if (playerInCampaign.role === 'dungeon_master') {
                master.push(campaignComplete);
            }

            if (playerInCampaign.role === 'player' || playerInCampaign.role === 'admin_player') {
                player.push(campaignComplete);
            }
        });

        return { master, player };
    }
}
