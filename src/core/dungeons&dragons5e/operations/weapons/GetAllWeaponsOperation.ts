import { Internacional } from './../../../../domains/dungeons&dragons5e/LanguagesWrapper';
import { Weapon } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { GetAllWeaponsOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/weapons/GetAllWeapons';

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
