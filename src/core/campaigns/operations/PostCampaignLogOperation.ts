import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { PostCampaignLogPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class PostCampaignLogOperation {
    private readonly postCampaignLogService;
    private readonly socketIO;
    private readonly logger;

    constructor({
        postCampaignLogService,
        socketIO,
        logger,
    }: CampaignCoreDependencies['postCampaignLogOperationContract']) {
        this.postCampaignLogService = postCampaignLogService;
        this.socketIO = socketIO;
        this.logger = logger;
    }

    public async execute(payload: PostCampaignLogPayload): Promise<Campaign> {
        this.logger('info', 'Execute - PostCampaignLogOperation');

        const savedCampaign = await this.postCampaignLogService.createLog(payload);
        const createdLog = savedCampaign.matchData.logs[savedCampaign.matchData.logs.length - 1];

        this.socketIO.syncActiveCampaign(savedCampaign);
        this.socketIO.emitToCampaign(payload.campaignId, 'match:log_created', {
            campaignId: payload.campaignId,
            log: createdLog,
        });

        return savedCampaign;
    }
}
