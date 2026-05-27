import { PlayerNotes } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { UpdateCampaignPlayerNotePayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class UpdateCampaignPlayerNoteOperation {
    private readonly updateCampaignPlayerNoteService;
    private readonly logger;

    constructor({
        updateCampaignPlayerNoteService,
        logger,
    }: CampaignCoreDependencies['updateCampaignPlayerNoteOperationContract']) {
        this.updateCampaignPlayerNoteService = updateCampaignPlayerNoteService;
        this.logger = logger;
    }

    public async execute(payload: UpdateCampaignPlayerNotePayload): Promise<PlayerNotes> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);

        const { campaign } = await this.updateCampaignPlayerNoteService.updateNote(payload);
        const savedCampaign = await this.updateCampaignPlayerNoteService.save(campaign);
        const player = savedCampaign.campaignPlayers.find(
            (campaignPlayer: (typeof savedCampaign.campaignPlayers)[number]) => campaignPlayer.userId === payload.userId
        );

        return player?.notes.find((note: PlayerNotes) => note.title === payload.title) as PlayerNotes;
    }
}
