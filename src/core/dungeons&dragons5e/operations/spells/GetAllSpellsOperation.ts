import { Spell } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllSpellsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/spells/GetAllSpells';

export default class GetAllSpellsOperation {
    private readonly getAllSpellsService;
    private readonly logger;

    constructor({ getAllSpellsService, logger }: GetAllSpellsOperationContract) {
        this.getAllSpellsService = getAllSpellsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Spell>>> {
        this.logger('info', 'Execute - GetAllSpellsOperation');
        const spells = await this.getAllSpellsService.getAll();

        return spells;
    }
}
