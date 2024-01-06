import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { Weapon } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { GetAllWeaponsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/weapons/GetAllWeapons';

export default class GetAllWeaponsOperation {
    private readonly _getAllWeaponsService;
    private readonly _logger;

    constructor({ getAllWeaponsService, logger }: GetAllWeaponsOperationContract) {
        this._getAllWeaponsService = getAllWeaponsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Weapon>>> {
        this._logger('info', 'Execute - GetAllWeaponsOperation');
        const weapons = await this._getAllWeaponsService.getAll();
        return weapons;
    }
}
