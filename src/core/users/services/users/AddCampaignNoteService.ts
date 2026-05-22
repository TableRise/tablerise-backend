import { GameInfoCampaigns } from '@tablerise/database-management/dist/src/interfaces/User';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { AddCampaignNotePayload } from 'src/types/api/users/http/payload';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class AddCampaignNoteService {
    private readonly usersDetailsRepository;
    private readonly logger;

    constructor({ usersDetailsRepository, logger }: UserCoreDependencies['addCampaignNoteServiceContract']) {
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;

        this.add = this.add.bind(this);
    }

    public async add({ userId, campaignId, note }: AddCampaignNotePayload): Promise<GameInfoCampaigns> {
        const callName = `[${this.constructor.name}] - ${this.add.name}`;
        this.logger('info', callName);

        const userDetailInDb = await this.usersDetailsRepository.findOne({ userId });
        const campaign = userDetailInDb.gameInfo.campaigns.find((item) => item.campaignId === campaignId);

        if (!campaign) HttpRequestErrors.throwError('campaign-player-not-exists');

        campaign.notes = campaign.notes ?? [];
        campaign.notes.push(note);

        await this.usersDetailsRepository.update({
            query: { userDetailId: userDetailInDb.userDetailId },
            payload: userDetailInDb,
        });

        return campaign;
    }
}
