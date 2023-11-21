import { Weapon } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetWeaponOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/weapons/GetWeapon';

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
