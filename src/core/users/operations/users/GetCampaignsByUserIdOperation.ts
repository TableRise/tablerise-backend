import { GetCampaignByUserIdResponse } from 'src/types/api/campaigns/http/response';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class GetCampaignsByUserIdOperation {
    private readonly getCampaignsByUserIdService: any;
    private readonly logger: any;

    constructor({
        getCampaignsByUserIdService,
        logger,
    }: UserCoreDependencies['getCampaignsByUserIdOperationContract']) {
        this.getCampaignsByUserIdService = getCampaignsByUserIdService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(userId: string): Promise<GetCampaignByUserIdResponse> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        return this.getCampaignsByUserIdService.getByUserId(userId);
    }
}
