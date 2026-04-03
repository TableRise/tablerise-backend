import { updateMatchDatePayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class updateMatchDateOperation {
    private readonly updateMatchDateService;
    private readonly logger;

    constructor({
        updateMatchDateService,
        logger,
    }: CampaignCoreDependencies['updateMatchDateOperationContract']) {
        this.updateMatchDateService = updateMatchDateService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: updateMatchDatePayload): Promise<string> {
        this.logger('info', 'Execute - updateMatchDateOperation');
        const campaignWithOperationDone = await this.updateMatchDateService.updateMatchDate(payload);
        const savedCampaign = await this.updateMatchDateService.save(campaignWithOperationDone);

        return savedCampaign.infos.nextMatchDate;
    }
}
