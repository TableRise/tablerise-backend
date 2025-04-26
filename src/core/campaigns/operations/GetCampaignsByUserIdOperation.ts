import { GetCampaignByUserIdResponse } from 'src/types/api/campaigns/http/response';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class GetCampaignsByUserIdOperation {
    private readonly _getCampaignsByUserIdService: any;
    private readonly _logger: any;

    constructor({
        getCampaignsByUserIdService,
        logger,
    }: CampaignCoreDependencies['getCampaignsByUserIdOperationContract']) {
        this._getCampaignsByUserIdService = getCampaignsByUserIdService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(userId: string): Promise<GetCampaignByUserIdResponse> {
        this._logger('info', 'Execute - GetCampaignsByUserIdOperation');
        return this._getCampaignsByUserIdService.getByUserId(userId);
    }
}
