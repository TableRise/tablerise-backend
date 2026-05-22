import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { addCharacterPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class RemovePlayerCharacterOperation {
    private readonly removePlayerCharacterService;
    private readonly logger;

    constructor({
        removePlayerCharacterService,
        logger,
    }: CampaignCoreDependencies['removePlayerCharacterOperationContract']) {
        this.removePlayerCharacterService = removePlayerCharacterService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: addCharacterPayload): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);

        const campaignWithCharacterRemoved = await this.removePlayerCharacterService.removeCharacter(payload);
        return this.removePlayerCharacterService.save(campaignWithCharacterRemoved);
    }
}
