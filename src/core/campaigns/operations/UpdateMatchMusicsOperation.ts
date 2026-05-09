import { Music } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import {
    AddMatchMusicPayload,
    EditMatchMusicPayload,
    RemoveMatchMusicPayload,
} from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateMatchMusicsOperation {
    private readonly updateMatchMusicsService;
    private readonly socketIO;
    private readonly logger;

    constructor({
        updateMatchMusicsService,
        socketIO,
        logger,
    }: CampaignCoreDependencies['updateMatchMusicsOperationContract']) {
        this.updateMatchMusicsService = updateMatchMusicsService;
        this.socketIO = socketIO;
        this.logger = logger;

        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.edit = this.edit.bind(this);
    }

    private syncCampaign(campaignId: string, musics: Music[]): void {
        this.socketIO.emitToCampaign(campaignId, 'campaign:musics_updated', {
            campaignId,
            musics,
        });
    }

    async add(payload: AddMatchMusicPayload): Promise<Music[]> {
        this.logger('info', 'Add - UpdateMatchMusicsOperation');
        const campaignWithOperationDone = await this.updateMatchMusicsService.addMatchMusic(payload);
        const savedCampaign = await this.updateMatchMusicsService.save(campaignWithOperationDone);

        this.socketIO.syncActiveCampaign(savedCampaign);
        this.syncCampaign(payload.campaignId, savedCampaign.musics);
        return savedCampaign.musics;
    }

    async remove(payload: RemoveMatchMusicPayload): Promise<Music[]> {
        this.logger('info', 'Remove - UpdateMatchMusicsOperation');
        const campaignWithOperationDone = await this.updateMatchMusicsService.removeMatchMusic(payload);
        const savedCampaign = await this.updateMatchMusicsService.save(campaignWithOperationDone);

        this.socketIO.syncActiveCampaign(savedCampaign);
        this.syncCampaign(payload.campaignId, savedCampaign.musics);
        return savedCampaign.musics;
    }

    async edit(payload: EditMatchMusicPayload): Promise<Music[]> {
        this.logger('info', 'Edit - UpdateMatchMusicsOperation');
        const campaignWithOperationDone = await this.updateMatchMusicsService.editMatchMusic(payload);
        const savedCampaign = await this.updateMatchMusicsService.save(campaignWithOperationDone);

        this.socketIO.syncActiveCampaign(savedCampaign);
        this.syncCampaign(payload.campaignId, savedCampaign.musics);
        return savedCampaign.musics;
    }
}
