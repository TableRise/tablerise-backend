import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { Armor } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { GetAllArmorsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/armors/GetAllArmors';

export default class GetAllArmorsOperation {
    private readonly getAllArmorsService;
    private readonly logger;

    constructor({ getAllArmorsService, logger }: GetAllArmorsOperationContract) {
        this.getAllArmorsService = getAllArmorsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Armor>>> {
        this.logger('info', 'Execute - GetAllArmorsOperation');
        return this.getAllArmorsService.getAll();
    }
}
