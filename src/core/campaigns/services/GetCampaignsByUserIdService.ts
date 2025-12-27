import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import { GameInfoCampaigns } from '@tablerise/database-management/dist/src/interfaces/User';
import { GetCampaignByUserIdResponse } from 'src/types/api/campaigns/http/response';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';

export default class GetCampaignsByUserIdService {
    private readonly campaignsRepository;
    private readonly usersDetailsRepository;
    private readonly logger;

    constructor({
        campaignsRepository,
        usersDetailsRepository,
        logger,
    }: CampaignCoreDependencies['getCampaignsByUserIdServiceContract']) {
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

        const userCampaignsPromises = [] as Array<Promise<CampaignInstance>>;

        userCampaignIds.forEach((campaignId: string) => {
            userCampaignsPromises.push(this.campaignsRepository.findOne({ campaignId }));
        });

        const userCampaigns = await Promise.all(userCampaignsPromises);

        const master = [] as CampaignInstance[];
        const player = [] as CampaignInstance[];

        userDetailsInDb.gameInfo.campaigns.forEach((campaign: GameInfoCampaigns) => {
            if (campaign.role === 'dungeon_master') {
                const campaignComplete = userCampaigns.find(
                    (userCampaign) => userCampaign.campaignId === campaign.campaignId
                );
                master.push(campaignComplete as CampaignInstance);
            }

            if (campaign.role === 'player' || campaign.role === 'player_admin') {
                const campaignComplete = userCampaigns.find(
                    (userCampaign) => userCampaign.campaignId === campaign.campaignId
                );
                player.push(campaignComplete as CampaignInstance);
            }
        });

        return { master, player };
    }
}
