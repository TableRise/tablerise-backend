import { Weapon } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledWeaponsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/weapons/GetDisabledWeapons';

export default class GetDisabledWeaponsOperation {
    private readonly _getDisabledWeaponsService;
    private readonly _logger;

    constructor({ getDisabledWeaponsService, logger }: GetDisabledWeaponsOperationContract) {
        this._getDisabledWeaponsService = getDisabledWeaponsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Weapon>>> {
        this._logger('info', 'Execute - GetDisabledWeaponsOperation');
        const weapons = await this._getDisabledWeaponsService.getAllDisabled();
        return weapons;
    }
}
