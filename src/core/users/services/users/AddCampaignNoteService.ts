import { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { AddCampaignNotePayload } from 'src/types/api/users/http/payload';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class AddCampaignNoteService {
    private readonly usersDetailsRepository;
    private readonly campaignsRepository;
    private readonly logger;

    constructor({
        usersDetailsRepository,
        campaignsRepository,
        logger,
    }: UserCoreDependencies['addCampaignNoteServiceContract']) {
        this.usersDetailsRepository = usersDetailsRepository;
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;

        this.add = this.add.bind(this);
    }

    public async add({ userId, campaignId, note }: AddCampaignNotePayload): Promise<Player> {
        const callName = `[${this.constructor.name}] - ${this.add.name}`;
        this.logger('info', callName);

        const campaignInDb = await this.campaignsRepository.findOne({ campaignId });
        if (!campaignInDb) HttpRequestErrors.throwError('campaign-inexistent');
        const campaignPlayer = campaignInDb.campaignPlayers.findIndex((player) => player.userId === userId);
        if (campaignPlayer === -1) HttpRequestErrors.throwError('campaign-player-not-exists');

        campaignInDb.campaignPlayers[campaignPlayer].notes = campaignInDb.campaignPlayers[campaignPlayer].notes ?? [];
        campaignInDb.campaignPlayers[campaignPlayer].notes.push(note);

        await this.campaignsRepository.update({
            query: { campaignId: campaignInDb.campaignId },
            payload: campaignInDb,
        });

        return campaignInDb.campaignPlayers[campaignPlayer];
    }
}
