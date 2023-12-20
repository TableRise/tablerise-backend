import { Monster } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledMonstersOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/monsters/GetDisabledMonsters';

export default class GetDisabledMonstersOperation {
    private readonly _getDisabledMonstersService;
    private readonly _logger;

    constructor({
        getDisabledMonstersService,
        logger,
    }: GetDisabledMonstersOperationContract) {
        this._getDisabledMonstersService = getDisabledMonstersService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Monster>>> {
        this._logger('info', 'Execute - GetMonsterOperation');
        const monsters = await this._getDisabledMonstersService.getAllDisabled();
        return monsters;
    }
}
