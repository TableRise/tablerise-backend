import { Spell } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetSpellOperationContract } from 'src/types/modules/core/dungeons&dragons5e/spells/GetSpell';

export default class GetSpellOperation {
    private readonly getSpellService;
    private readonly logger;

    constructor({ getSpellService, logger }: GetSpellOperationContract) {
        this.getSpellService = getSpellService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Spell>> {
        this.logger('info', 'Execute - GetSpellOperation');
        const spell = await this.getSpellService.get(id);

        return spell;
    }
}
