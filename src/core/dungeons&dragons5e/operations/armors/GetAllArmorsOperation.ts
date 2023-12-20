import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { Armor } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { GetAllArmorsOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/armors/GetAllArmorsOperation';

export default class GetAllArmorsOperation {
    private readonly _getAllArmorsService;
    private readonly _logger;

    constructor({ getAllArmorsService, logger }: GetAllArmorsOperationContract) {
        this._getAllArmorsService = getAllArmorsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Armor>>> {
        this._logger('info', 'Execute - GetAllArmorsOperation');
        return this._getAllArmorsService.getAll();
    }
}
