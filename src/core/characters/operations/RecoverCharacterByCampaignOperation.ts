import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import { GetCharacterByCampaignPayload } from 'src/types/api/characters/http/payload';
import { CharacterToPlayerRecover } from 'src/types/api/characters/http/response';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class RecoverCharacterByCampaignOperation {
    private readonly recoverCharacterByCampaignService;
    private readonly logger;

    constructor({
        recoverCharacterByCampaignService,
        logger,
    }: CharacterCoreDependencies['recoverCharacterByCampaignOperationContract']) {
        this.recoverCharacterByCampaignService = recoverCharacterByCampaignService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(
        payload: GetCharacterByCampaignPayload
    ): Promise<CharactersDnd[] | CharacterToPlayerRecover[]> {
        this.logger('info', 'RecoverCharacterByCampaignOperation - Execute');
        return this.recoverCharacterByCampaignService.recoverByCampaign(payload);
    }
}
