import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import Campaign, { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';

export default class TransferDungeonMasterService {
    private readonly campaignsRepository;
    private readonly logger;

    constructor({ logger, campaignsRepository }: CampaignCoreDependencies['transferDungeonMasterServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    public async transfer(campaignId: string, userId: string, userToMaster: string): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.transfer.name}`;
        this.logger('info', callName);

        const campaign = await this.campaignsRepository.findOne({ campaignId });

        const caller = campaign.campaignPlayers.find((p: { userId: string }) => p.userId === userId);

        if (!caller || caller.role !== 'dungeon_master') {
            HttpRequestErrors.throwError('forbidden-role-operation');
        }

        const target = campaign.campaignPlayers.find((p: { userId: string }) => p.userId === userToMaster);

        if (!target) HttpRequestErrors.throwError('campaign-player-not-exists');

        campaign.campaignPlayers = campaign.campaignPlayers.map((p: Player) => {
            if (p.userId === userId) return { ...p, role: 'player' as const };
            if (p.userId === userToMaster) return { ...p, role: 'dungeon_master' as const };
            return p;
        });

        return await this.campaignsRepository.update({
            query: { campaignId },
            payload: campaign,
        });
    }
}
