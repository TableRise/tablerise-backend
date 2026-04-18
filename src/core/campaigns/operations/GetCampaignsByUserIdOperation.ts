import { GetCampaignByUserIdResponse } from 'src/types/api/campaigns/http/response';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class GetCampaignsByUserIdOperation {
    private readonly getCampaignsByUserIdService: any;
    private readonly logger: any;

    constructor({
        getCampaignsByUserIdService,
        logger,
    }: CampaignCoreDependencies['getCampaignsByUserIdOperationContract']) {
        this.getCampaignsByUserIdService = getCampaignsByUserIdService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(userId: string): Promise<GetCampaignByUserIdResponse> {
        this.logger('info', 'Execute - GetCampaignsByUserIdOperation');
        console.log(userId);
        return this.getCampaignsByUserIdService.getByUserId(userId);
    }
}
