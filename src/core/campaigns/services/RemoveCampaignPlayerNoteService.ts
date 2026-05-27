import { Player, PlayerNotes } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { RemoveCampaignPlayerNotePayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class RemoveCampaignPlayerNoteService {
    private readonly campaignsRepository;
    private readonly logger;

    constructor({ campaignsRepository, logger }: CampaignCoreDependencies['removeCampaignPlayerNoteServiceContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;
    }

    public async removeNote(payload: RemoveCampaignPlayerNotePayload): Promise<any> {
        const callName = `[${this.constructor.name}] - ${this.removeNote.name}`;
        this.logger('info', callName);

        const { campaignId, userId, title } = payload;
        const campaign = await this.campaignsRepository.findOne({ campaignId });
        const playerIndex = campaign.campaignPlayers.findIndex((player: Player) => player.userId === userId);

        if (playerIndex === -1) HttpRequestErrors.throwError('campaign-player-not-exists');

        campaign.campaignPlayers[playerIndex].notes = campaign.campaignPlayers[playerIndex].notes ?? [];

        const noteIndex = campaign.campaignPlayers[playerIndex].notes.findIndex(
            (note: PlayerNotes) => note.title === title
        );

        if (noteIndex === -1) HttpRequestErrors.throwError('content-inexistent');

        campaign.campaignPlayers[playerIndex].notes.splice(noteIndex, 1);

        return campaign;
    }

    public async save(campaign: any): Promise<any> {
        const callName = `[${this.constructor.name}] - ${this.save.name}`;
        this.logger('info', callName);
        return this.campaignsRepository.update({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    }
}
