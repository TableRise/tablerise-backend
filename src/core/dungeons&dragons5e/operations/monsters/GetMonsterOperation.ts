import { Monster } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetMonsterOperationContract } from 'src/types/modules/core/dungeons&dragons5e/monsters/GetMonster';

export default class GetMonsterOperation {
    private readonly _getMonsterService;
    private readonly _logger;

    constructor({ getMonsterService, logger }: GetMonsterOperationContract) {
        this._getMonsterService = getMonsterService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Monster>> {
        this._logger('info', 'Execute - GetMonsterOperation');
        const monster = await this._getMonsterService.get(id);
        return monster;
    }
}
