import { Monster } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetMonsterOperationContract } from 'src/types/modules/core/dungeons&dragons5e/monsters/GetMonster';

export default class GetMonsterOperation {
    private readonly getMonsterService;
    private readonly logger;

    constructor({ getMonsterService, logger }: GetMonsterOperationContract) {
        this.getMonsterService = getMonsterService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Monster>> {
        this.logger('info', 'Execute - GetMonsterOperation');
        const monster = await this.getMonsterService.get(id);
        return monster;
    }
}
