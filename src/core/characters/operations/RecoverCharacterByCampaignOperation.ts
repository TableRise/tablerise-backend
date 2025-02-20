import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';
import { GetCharacterByCampaignPayload } from 'src/types/api/characters/http/payload';
import { CharacterToPlayerRecover } from 'src/types/api/characters/http/response';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class RecoverCharacterByCampaignOperation {
    private readonly _recoverCharacterByCampaignService;
    private readonly _logger;

    constructor({
        recoverCharacterByCampaignService,
        logger,
    }: CharacterCoreDependencies['recoverCharacterByCampaignOperationContract']) {
        this._recoverCharacterByCampaignService = recoverCharacterByCampaignService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(
        payload: GetCharacterByCampaignPayload
    ): Promise<CharacterInstance[] | CharacterToPlayerRecover[]> {
        this._logger('info', 'RecoverCharacterByCampaignOperation - Execute');
        return this._recoverCharacterByCampaignService.recoverByCampaign(payload);
    }
}
