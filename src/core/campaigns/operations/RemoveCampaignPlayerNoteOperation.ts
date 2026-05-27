import { RemoveCampaignPlayerNotePayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class RemoveCampaignPlayerNoteOperation {
    private readonly removeCampaignPlayerNoteService;
    private readonly logger;

    constructor({
        removeCampaignPlayerNoteService,
        logger,
    }: CampaignCoreDependencies['removeCampaignPlayerNoteOperationContract']) {
        this.removeCampaignPlayerNoteService = removeCampaignPlayerNoteService;
        this.logger = logger;
    }

    public async execute(payload: RemoveCampaignPlayerNotePayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);

        const campaign = await this.removeCampaignPlayerNoteService.removeNote(payload);
        await this.removeCampaignPlayerNoteService.save(campaign);
    }
}
