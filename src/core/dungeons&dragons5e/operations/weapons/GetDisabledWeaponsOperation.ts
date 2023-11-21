import { Weapon } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetDisabledWeaponsOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/weapons/GetDisabledWeapons';

export default class GetDisabledWeaponsOperation {
    private readonly _getDisabledWeaponsService;
    private readonly _logger;

    constructor({
        getDisabledWeaponsService,
        logger,
    }: GetDisabledWeaponsOperationContract) {
        this._getDisabledWeaponsService = getDisabledWeaponsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Weapon>>> {
        this._logger('info', 'Execute - GetWeaponOperation');
        const weapons = await this._getDisabledWeaponsService.getAllDisabled();
        return weapons;
    }
}
