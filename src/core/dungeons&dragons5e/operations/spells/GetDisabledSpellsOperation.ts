import { Spell } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledSpellsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/spells/GetDisabledSpells';

export default class GetDisabledSpellsOperation {
    private readonly getDisabledSpellsService;
    private readonly logger;

    constructor({ getDisabledSpellsService, logger }: GetDisabledSpellsOperationContract) {
        this.getDisabledSpellsService = getDisabledSpellsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Spell>>> {
        this.logger('info', 'Execute - GetDisabledSpellsOperation');
        const spells = await this.getDisabledSpellsService.getAllDisabled();

        return spells;
    }
}
