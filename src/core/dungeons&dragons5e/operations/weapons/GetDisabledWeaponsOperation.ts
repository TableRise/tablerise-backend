import { Weapon } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledWeaponsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/weapons/GetDisabledWeapons';

export default class GetDisabledWeaponsOperation {
    private readonly getDisabledWeaponsService;
    private readonly logger;

    constructor({ getDisabledWeaponsService, logger }: GetDisabledWeaponsOperationContract) {
        this.getDisabledWeaponsService = getDisabledWeaponsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Weapon>>> {
        this.logger('info', 'Execute - GetDisabledWeaponsOperation');
        const weapons = await this.getDisabledWeaponsService.getAllDisabled();
        return weapons;
    }
}
