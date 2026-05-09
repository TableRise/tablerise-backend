import { AddMatchDatePayload, RemoveMatchDatePayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class updateMatchDateOperation {
    private readonly updateMatchDateService;
    private readonly socketIO;
    private readonly logger;

    constructor({
        updateMatchDateService,
        socketIO,
        logger,
    }: CampaignCoreDependencies['updateMatchDateOperationContract']) {
        this.updateMatchDateService = updateMatchDateService;
        this.socketIO = socketIO;
        this.logger = logger;

        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
    }

    private syncCampaign(campaignId: string, nextMatchDate: string): void {
        this.socketIO.emitToCampaign(campaignId, 'campaign:settings_updated', {
            campaignId,
            nextMatchDate,
        });
    }

    async add(payload: AddMatchDatePayload): Promise<string> {
        this.logger('info', 'Add - updateMatchDateOperation');
        const campaignWithOperationDone = await this.updateMatchDateService.addMatchDate(payload);
        const savedCampaign = await this.updateMatchDateService.save(campaignWithOperationDone);

        this.socketIO.syncActiveCampaign(savedCampaign);
        this.syncCampaign(payload.campaignId, savedCampaign.infos.nextMatchDate);

        return savedCampaign.infos.nextMatchDate;
    }

    async remove(payload: RemoveMatchDatePayload): Promise<string> {
        this.logger('info', 'Remove - updateMatchDateOperation');
        const campaignWithOperationDone = await this.updateMatchDateService.removeMatchDate(payload);
        const savedCampaign = await this.updateMatchDateService.save(campaignWithOperationDone);

        this.socketIO.syncActiveCampaign(savedCampaign);
        this.syncCampaign(payload.campaignId, savedCampaign.infos.nextMatchDate);
        return savedCampaign.infos.nextMatchDate;
    }
}
