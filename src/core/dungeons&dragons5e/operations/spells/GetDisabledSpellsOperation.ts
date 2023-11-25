import { Spell } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledSpellsOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/spells/GetDisabledSpells';

export default class GetDisabledSpellsOperation {
    private readonly _getDisabledSpellsService;
    private readonly _logger;

    constructor({
        getDisabledSpellsService,
        logger,
    }: GetDisabledSpellsOperationContract) {
        this._getDisabledSpellsService = getDisabledSpellsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Spell>>> {
        this._logger('info', 'Execute - GetDisabledSpellsOperation');
        const spells = await this._getDisabledSpellsService.getAllDisabled();

        return spells;
    }
}
