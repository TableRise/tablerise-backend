import Campaign, { Journal } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HighlightedJournalPayload, UpdateCampaignJournalHighlightPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateCampaignJournalHighlightService {
    private readonly campaignsRepository;
    private readonly socketIO;
    private readonly logger;

    constructor({
        logger,
        campaignsRepository,
        socketIO,
    }: CampaignCoreDependencies['updateCampaignJournalHighlightServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.socketIO = socketIO;
        this.logger = logger;
    }

    public async updateHighlight({
        campaignId,
        userId,
        toggle,
        post,
    }: UpdateCampaignJournalHighlightPayload): Promise<HighlightedJournalPayload> {
        this.logger('info', 'Execute - UpdateCampaignJournalHighlightService');

        const campaign = await this.campaignsRepository.findOne({ campaignId });
        const caller = campaign.campaignPlayers.find((player: { userId: string }) => player.userId === userId);

        if (!caller || caller.role === 'player') {
            HttpRequestErrors.throwError('forbidden-role-operation');
        }

        campaign.infos.highlightedJournal =
            toggle === 'on' ? (post as Journal) : ({} as unknown as Campaign['infos']['highlightedJournal']);

        const updatedCampaign = await this.campaignsRepository.update({
            query: { campaignId },
            payload: campaign,
        });

        this.socketIO.syncActiveCampaign(updatedCampaign);
        this.socketIO.emitToCampaign(campaignId, 'journal:highlight_changed', {
            campaignId,
            highlightedJournalPost: (updatedCampaign.infos.highlightedJournal ?? null) || null,
        });

        return (updatedCampaign.infos.highlightedJournal ?? {}) as HighlightedJournalPayload;
    }
}
