import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { Monster } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { GetAllMonstersOperationContract } from 'src/types/modules/core/dungeons&dragons5e/monsters/GetAllMonsters';

export default class GetAllMonstersOperation {
    private readonly getAllMonstersService;
    private readonly logger;

    constructor({ getAllMonstersService, logger }: GetAllMonstersOperationContract) {
        this.getAllMonstersService = getAllMonstersService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Monster>>> {
        this.logger('info', 'Execute - GetAllMonstersOperation');
        const monsters = await this.getAllMonstersService.getAll();
        return monsters;
    }
}
