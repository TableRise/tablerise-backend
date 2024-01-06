import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { Monster } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { GetAllMonstersOperationContract } from 'src/types/modules/core/dungeons&dragons5e/monsters/GetAllMonsters';

export default class GetAllMonstersOperation {
    private readonly _getAllMonstersService;
    private readonly _logger;

    constructor({ getAllMonstersService, logger }: GetAllMonstersOperationContract) {
        this._getAllMonstersService = getAllMonstersService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Monster>>> {
        this._logger('info', 'Execute - GetAllMonstersOperation');
        const monsters = await this._getAllMonstersService.getAll();
        return monsters;
    }
}
