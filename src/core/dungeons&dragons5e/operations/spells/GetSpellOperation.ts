import { Spell } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetSpellOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/spells/GetSpell';

export default class GetSpellOperation {
    private readonly _getSpellService;
    private readonly _logger;

    constructor({ getSpellService, logger }: GetSpellOperationContract) {
        this._getSpellService = getSpellService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Spell>> {
        this._logger('info', 'Execute - GetSpellOperation');
        const spell = await this._getSpellService.get(id);

        return spell;
    }
}
