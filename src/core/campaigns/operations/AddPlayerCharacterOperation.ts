import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { addCharacterPayload } from 'src/types/api/campaigns/http/payload';
import CampaignCoreDependencies from 'src/types/modules/core/campaigns/CampaignCoreDependencies';

export default class AddPlayerCharacterOperation {
    private readonly _addPlayerCharacterService;
    private readonly _logger;

    constructor({
        addPlayerCharacterService,
        logger,
    }: CampaignCoreDependencies['addPlayerCharacterOperationContract']) {
        this._addPlayerCharacterService = addPlayerCharacterService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: addCharacterPayload): Promise<CampaignInstance> {
        this._logger('info', 'Execute - AddPlayerCharacterOperation');

        const campaignWithPlayerAdded =
            await this._addPlayerCharacterService.addCharacter(payload);
        return this._addPlayerCharacterService.save(campaignWithPlayerAdded);
    }
}
