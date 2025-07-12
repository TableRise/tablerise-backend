import { Armor } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledArmorsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/armors/GetDisabledArmors';

export default class GetDisabledArmorsOperation {
    private readonly _getDisabledArmorsService;
    private readonly _logger;

    constructor({ getDisabledArmorsService, logger }: GetDisabledArmorsOperationContract) {
        this._getDisabledArmorsService = getDisabledArmorsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Armor>>> {
        this._logger('info', 'Execute - GetArmorOperation');
        const armors = await this._getDisabledArmorsService.getAllDisabled();
        return armors;
    }
}
