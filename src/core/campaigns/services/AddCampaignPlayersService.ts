import { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import SecurePasswordHandler from 'src/domains/users/helpers/SecurePasswordHandler';
import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import { AddCampaignPlayersPayload } from 'src/types/api/campaigns/http/payload';
import { UpdateMatchPlayersResponse } from 'src/types/api/users/methods';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class AddCampaignPlayersService {
    private readonly campaignsRepository;
    private readonly usersDetailsRepository;
    private readonly logger;

    constructor({
        campaignsRepository,
        usersDetailsRepository,
        logger,
    }: CampaignCoreDependencies['addCampaignPlayersServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;
    }

    public async addCampaignPlayers({
        campaignId,
        userId,
        password,
    }: AddCampaignPlayersPayload): Promise<UpdateMatchPlayersResponse> {
        this.logger('info', 'AddCampaignPlayers - AddCampaignPlayersService');
        const campaign = await this.campaignsRepository.findOne({ campaignId });

        const isPasswordValid = await SecurePasswordHandler.comparePassword(password, campaign.password);

        if (!isPasswordValid) HttpRequestErrors.throwError('unauthorized');

        const userDetails = await this.usersDetailsRepository.findOne({ userId });
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

    async save(campaign: Campaign, userDetails: UserDetail): Promise<Campaign> {
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
