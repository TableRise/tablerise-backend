import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { RemoveCampaignPlayersPayload } from 'src/types/api/campaigns/http/payload';
import { UpdateMatchPlayersResponse } from 'src/types/api/users/methods';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class RemoveCampaignPlayersService {
    private readonly _campaignsRepository;
    private readonly _usersDetailsRepository;
    private readonly _logger;

    constructor({
        campaignsRepository,
        usersDetailsRepository,
        logger,
    }: CampaignCoreDependencies['removeCampaignPlayersServiceContract']) {
        this._campaignsRepository = campaignsRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;
    }

    async removeCampaignPlayers({
        campaignId,
        userId,
    }: RemoveCampaignPlayersPayload): Promise<UpdateMatchPlayersResponse> {
        this._logger('info', 'RemoveCampaignPlayers - RemoveCampaignPlayersService');
        const campaign = await this._campaignsRepository.findOne({ campaignId });

        const userDetails = await this._usersDetailsRepository.findOne({ userId });
        const dungeonMaster = campaign.campaignPlayers.find((player) => player.role === 'dungeon_master');

        if (dungeonMaster?.userId === userId) HttpRequestErrors.throwError('player-master-equal');

        userDetails.gameInfo.campaigns = userDetails.gameInfo.campaigns.filter(
            (campaign) => campaign.campaignId !== campaignId
        );

        campaign.campaignPlayers = campaign.campaignPlayers.filter((player) => player.userId !== userId);

        return { campaign, userDetails };
    }

    async save(campaign: CampaignInstance, userDetails: UserDetailInstance): Promise<CampaignInstance> {
        await this._usersDetailsRepository.update({
            query: { userDetailId: userDetails.userDetailId },
            payload: userDetails,
        });

        return this._campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
