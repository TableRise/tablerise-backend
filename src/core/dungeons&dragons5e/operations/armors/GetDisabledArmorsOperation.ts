import { Armor } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetDisabledArmorsOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/armors/GetDisabledArmors';

export default class GetDisabledArmorsOperation {
    private readonly _getDisabledArmorsService;
    private readonly _logger;

    constructor({
        getDisabledArmorsService,
        logger,
    }: GetDisabledArmorsOperationContract) {
        this._getDisabledArmorsService = getDisabledArmorsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Array<Internacional<Armor>>> {
        this._logger('info', 'Execute - GetArmorOperation');
        const armors = await this._getDisabledArmorsService.getAllDisabled();
        return armors;
    }
}
