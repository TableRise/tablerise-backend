import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import { RemoveCampaignPlayersPayload } from 'src/types/api/campaigns/http/payload';
import { UpdateMatchPlayersResponse } from 'src/types/api/users/methods';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class RemoveCampaignPlayersService {
    private readonly campaignsRepository;
    private readonly usersDetailsRepository;
    private readonly logger;

    constructor({
        campaignsRepository,
        usersDetailsRepository,
        logger,
    }: CampaignCoreDependencies['removeCampaignPlayersServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;
    }

    async removeCampaignPlayers({
        campaignId,
        userId,
    }: RemoveCampaignPlayersPayload): Promise<UpdateMatchPlayersResponse> {
        this.logger('info', 'RemoveCampaignPlayers - RemoveCampaignPlayersService');
        const campaign = await this.campaignsRepository.findOne({ campaignId });

        const userDetails = await this.usersDetailsRepository.findOne({ userId });
        const dungeonMaster = campaign.campaignPlayers.find((player) => player.role === 'dungeon_master');

        if (dungeonMaster?.userId === userId) HttpRequestErrors.throwError('player-master-equal');

        userDetails.gameInfo.campaigns = userDetails.gameInfo.campaigns.filter(
            (campaign) => campaign.campaignId !== campaignId
        );

        campaign.campaignPlayers = campaign.campaignPlayers.filter((player) => player.userId !== userId);

        return { campaign, userDetails };
    }

    async save(campaign: CampaignInstance, userDetails: UserDetail): Promise<CampaignInstance> {
        await this.usersDetailsRepository.update({
            query: { userDetailId: userDetails.userDetailId },
            payload: userDetails,
        });

        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
