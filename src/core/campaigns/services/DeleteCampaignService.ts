import Campaign, { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class DeleteCampaignService {
    private readonly campaignsRepository;
    private readonly usersDetailsRepository;
    private readonly charactersRepository;
    private readonly logger;

    constructor({
        campaignsRepository,
        usersDetailsRepository,
        charactersRepository,
        logger,
    }: CampaignCoreDependencies['deleteCampaignServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.charactersRepository = charactersRepository;
        this.logger = logger;
    }

    private validateCaller(campaign: Campaign, userId: string): void {
        const caller = campaign.campaignPlayers.find((player: Player) => player.userId === userId);

        if (!caller || caller.role !== 'dungeon_master') {
            HttpRequestErrors.throwError('forbidden-role-operation');
        }
    }

    public async deleteCampaign(campaignId: string, userId: string): Promise<void> {
        this.logger('info', 'Execute - DeleteCampaignService');

        const campaign = await this.campaignsRepository.findOne({ campaignId });

        this.validateCaller(campaign, userId);

        const userIds = [...new Set(campaign.campaignPlayers.map((player) => player.userId))];
        const userDetailsList = await Promise.all(
            userIds.map(async (playerUserId) => await this.usersDetailsRepository.findOne({ userId: playerUserId }))
        );
        const characters = await this.charactersRepository.find({ campaignId });

        await Promise.all(
            userDetailsList.map(async (userDetails) => {
                userDetails.gameInfo.campaigns = userDetails.gameInfo.campaigns.filter(
                    (campaignInfo) => campaignInfo.campaignId !== campaignId
                );

                await this.usersDetailsRepository.update({
                    query: { userDetailId: userDetails.userDetailId },
                    payload: userDetails,
                });
            })
        );

        await Promise.all(
            characters.map(async (character) => {
                await this.charactersRepository.update({
                    query: { characterId: character.characterId },
                    payload: { campaignId: null },
                });
            })
        );

        await this.campaignsRepository.delete({ campaignId });
    }
}
