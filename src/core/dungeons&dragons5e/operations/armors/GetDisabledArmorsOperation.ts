import { Armor } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledArmorsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/armors/GetDisabledArmors';

export default class GetDisabledArmorsOperation {
    private readonly getDisabledArmorsService;
    private readonly logger;

    constructor({ getDisabledArmorsService, logger }: GetDisabledArmorsOperationContract) {
        this.getDisabledArmorsService = getDisabledArmorsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Armor>>> {
        this.logger('info', 'Execute - GetArmorOperation');
        const armors = await this.getDisabledArmorsService.getAllDisabled();
        return armors;
    }
}
