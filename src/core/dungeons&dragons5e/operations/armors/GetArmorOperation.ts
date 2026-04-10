import { Armor } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetArmorOperationContract } from 'src/types/modules/core/dungeons&dragons5e/armors/GetArmor';

export default class GetArmorOperation {
    private readonly getArmorService;
    private readonly logger;

    constructor({ getArmorService, logger }: GetArmorOperationContract) {
        this.getArmorService = getArmorService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Armor>> {
        this.logger('info', 'Execute - GetArmorOperation');
        const armor = await this.getArmorService.get(id);
        return armor;
    }
}
