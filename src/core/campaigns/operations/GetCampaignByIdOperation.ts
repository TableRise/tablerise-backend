import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { GetCampaignByIdPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class GetCampaignByIdOperation {
    private readonly getCampaignByIdService;
    private readonly logger;

    constructor({ getCampaignByIdService, logger }: CampaignCoreDependencies['getCampaignByIdOperationContract']) {
        this.getCampaignByIdService = getCampaignByIdService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute({ campaignId }: GetCampaignByIdPayload): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        return this.getCampaignByIdService.get({ campaignId });
    }
}
