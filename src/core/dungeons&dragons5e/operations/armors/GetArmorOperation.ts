import { Armor } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetArmorOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/armors/GetArmor';

export default class GetArmorOperation {
    private readonly _getArmorService;
    private readonly _logger;

    constructor({ getArmorService, logger }: GetArmorOperationContract) {
        this._getArmorService = getArmorService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Armor>> {
        this._logger('info', 'Execute - GetArmorOperation');
        const armor = await this._getArmorService.get(id);
        return armor;
    }
}