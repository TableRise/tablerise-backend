import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
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

    public async execute(payload: addCharacterPayload): Promise<CampaignInstance> {
        this.logger('info', 'Execute - AddPlayerCharacterOperation');

        const campaignWithPlayerAdded = await this.addPlayerCharacterService.addCharacter(payload);
        return this.addPlayerCharacterService.save(campaignWithPlayerAdded);
    }
}
