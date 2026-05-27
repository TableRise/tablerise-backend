import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { addCharacterPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class AddPlayerCharacterOperation {
    private readonly addPlayerCharacterService;
    private readonly logger;

    constructor({
        addPlayerCharacterService,
        logger,
    }: CampaignCoreDependencies['addPlayerCharacterOperationContract']) {
        this.addPlayerCharacterService = addPlayerCharacterService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: addCharacterPayload): Promise<Campaign> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);

        const campaignWithPlayerAdded = await this.addPlayerCharacterService.addCharacter(payload);
        return this.addPlayerCharacterService.save(campaignWithPlayerAdded);
    }
}
