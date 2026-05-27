import { Player } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { AddCampaignNotePayload } from 'src/types/api/users/http/payload';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class AddCampaignNoteOperation {
    private readonly addCampaignNoteService;
    private readonly logger;

    constructor({ addCampaignNoteService, logger }: UserCoreDependencies['addCampaignNoteOperationContract']) {
        this.addCampaignNoteService = addCampaignNoteService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: AddCampaignNotePayload): Promise<Player> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);
        return this.addCampaignNoteService.add(payload);
    }
}
