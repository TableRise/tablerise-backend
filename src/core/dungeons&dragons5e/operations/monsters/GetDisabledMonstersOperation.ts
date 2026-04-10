import { Monster } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledMonstersOperationContract } from 'src/types/modules/core/dungeons&dragons5e/monsters/GetDisabledMonsters';

export default class GetDisabledMonstersOperation {
    private readonly getDisabledMonstersService;
    private readonly logger;

    constructor({ getDisabledMonstersService, logger }: GetDisabledMonstersOperationContract) {
        this.getDisabledMonstersService = getDisabledMonstersService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Monster>>> {
        this.logger('info', 'Execute - GetMonsterOperation');
        const monsters = await this.getDisabledMonstersService.getAllDisabled();
        return monsters;
    }
}
