import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';
import { TUpdateCampaignBody } from 'src/interface/campaigns/presentation/campaigns/CampaignsSchemas';

export default class UpdateCampaignOperation {
    private readonly updateCampaignService;
    private readonly socketIO;
    private readonly logger;

    constructor({
        updateCampaignService,
        socketIO,
        logger,
    }: CampaignCoreDependencies['updateCampaignOperationContract']) {
        this.updateCampaignService = updateCampaignService;
        this.socketIO = socketIO;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    async execute(payload: TUpdateCampaignBody & { campaignId: string }): Promise<Campaign> {
        this.logger('info', 'Execute - UpdateCampaignOperation');
        const campaignUpdated = await this.updateCampaignService.update(payload);
        const savedCampaign = await this.updateCampaignService.save(campaignUpdated);

        this.socketIO.syncActiveCampaign(savedCampaign);
        this.socketIO.emitToCampaign(payload.campaignId, 'campaign:settings_updated', {
            campaignId: payload.campaignId,
            title: savedCampaign.title,
            description: savedCampaign.description,
            visibility: savedCampaign.infos.visibility,
            ageRestriction: savedCampaign.ageRestriction,
            nextMatchDate: savedCampaign.infos.nextMatchDate,
            nextSessionResume: savedCampaign.matchData?.nextSessionResume ?? null,
            playerAmountLimit: savedCampaign.infos.playerAmountLimit,
            socialMedia: savedCampaign.infos.socialMedia,
        });

        return savedCampaign;
    }
}
