import { HighlightedJournalPayload, UpdateCampaignJournalHighlightPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateCampaignJournalHighlightOperation {
    private readonly logger;
    private readonly updateCampaignJournalHighlightService;

    constructor({
        logger,
        updateCampaignJournalHighlightService,
    }: CampaignCoreDependencies['updateCampaignJournalHighlightOperationContract']) {
        this.updateCampaignJournalHighlightService = updateCampaignJournalHighlightService;
        this.logger = logger;
    }

    public async execute(payload: UpdateCampaignJournalHighlightPayload): Promise<HighlightedJournalPayload> {
        this.logger('info', 'Execute - UpdateCampaignJournalHighlightOperation');
        return this.updateCampaignJournalHighlightService.updateHighlight(payload);
    }
}
