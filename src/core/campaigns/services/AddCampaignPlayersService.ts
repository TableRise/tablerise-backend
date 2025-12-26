import { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import SecurePasswordHandler from 'src/domains/users/helpers/SecurePasswordHandler';
import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import { AddCampaignPlayersPayload } from 'src/types/api/campaigns/http/payload';
import { UpdateMatchPlayersResponse } from 'src/types/api/users/methods';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class AddCampaignPlayersService {
    private readonly _campaignsRepository;
    private readonly _usersDetailsRepository;
    private readonly _logger;

    constructor({
        campaignsRepository,
        usersDetailsRepository,
        logger,
    }: CampaignCoreDependencies['addCampaignPlayersServiceContract']) {
        this._campaignsRepository = campaignsRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;
    }

    public async addCampaignPlayers({
        campaignId,
        userId,
        password,
    }: AddCampaignPlayersPayload): Promise<UpdateMatchPlayersResponse> {
        this._logger('info', 'AddCampaignPlayers - AddCampaignPlayersService');
        const campaign = await this._campaignsRepository.findOne({ campaignId });

        const isPasswordValid = await SecurePasswordHandler.comparePassword(password, campaign.password);

        if (!isPasswordValid) HttpRequestErrors.throwError('unauthorized');

        const userDetails = await this._usersDetailsRepository.findOne({ userId });
        const dungeonMaster = campaign.campaignPlayers.find(
            (player: { role: string }) => player.role === 'dungeon_master'
        );

        if (dungeonMaster?.userId === userId) HttpRequestErrors.throwError('player-master-equal');

        const playerAlreadyInMatch = campaign.campaignPlayers.find(
            (player: { userId: string }) => player.userId === userId
        );

        if (playerAlreadyInMatch) {
            if (playerAlreadyInMatch.status === 'banned') {
                HttpRequestErrors.throwError('player-banned');
            }

            HttpRequestErrors.throwError('player-already-in-match');
        }

        const player: Player = {
            userId,
            characterIds: [],
            role: 'player',
            status: 'pending',
        };

        userDetails.gameInfo.campaigns.push({
            campaignId: campaign.campaignId,
            role: player.role,
            title: campaign.title,
            description: campaign.description,
            cover: campaign.cover as ImageObject,
        });

        campaign.campaignPlayers.push(player);

        return { campaign, userDetails };
    }

    async save(campaign: CampaignInstance, userDetails: UserDetail): Promise<CampaignInstance> {
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
