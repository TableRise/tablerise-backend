import { Internacional } from './../../../../domains/dungeons&dragons5e/LanguagesWrapper';
import { Armor } from "src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces";
import { GetAllArmorsOperationContract } from "src/types/dungeons&dragons5e/contracts/core/armors/GetAllArmors";

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
        const armors = await this._getAllArmorsService.getAll();
        return armors;
    }
}
