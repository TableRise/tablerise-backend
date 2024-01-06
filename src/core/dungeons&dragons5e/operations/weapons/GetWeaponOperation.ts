import { Weapon } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetWeaponOperationContract } from 'src/types/modules/core/dungeons&dragons5e/weapons/GetWeapon';

export default class GetWeaponOperation {
    private readonly _getWeaponService;
    private readonly _logger;

    constructor({ getWeaponService, logger }: GetWeaponOperationContract) {
        this._getWeaponService = getWeaponService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Weapon>> {
        this._logger('info', 'Execute - GetWeaponOperation');
        const weapon = await this._getWeaponService.get(id);
        return weapon;
    }
}
