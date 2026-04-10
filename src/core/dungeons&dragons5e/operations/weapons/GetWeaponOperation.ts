import { Weapon } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetWeaponOperationContract } from 'src/types/modules/core/dungeons&dragons5e/weapons/GetWeapon';

export default class GetWeaponOperation {
    private readonly getWeaponService;
    private readonly logger;

    constructor({ getWeaponService, logger }: GetWeaponOperationContract) {
        this.getWeaponService = getWeaponService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Weapon>> {
        this.logger('info', 'Execute - GetWeaponOperation');
        const weapon = await this.getWeaponService.get(id);
        return weapon;
    }
}
