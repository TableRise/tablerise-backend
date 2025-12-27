import { updateMatchDatePayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class updateMatchDateOperation {
    private readonly updateMatchDateService;
    private readonly campaignsSchema;
    private readonly schemaValidator;
    private readonly logger;

    constructor({
        updateMatchDateService,
        campaignsSchema,
        schemaValidator,
        logger,
    }: CampaignCoreDependencies['updateMatchDateOperationContract']) {
        this.updateMatchDateService = updateMatchDateService;
        this.schemaValidator = schemaValidator;
        this.campaignsSchema = campaignsSchema;
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
