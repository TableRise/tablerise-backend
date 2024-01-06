import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { God } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { GetAllGodsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/gods/GetAllGodsOperation';

export default class GetAllGodsOperation {
    private readonly _getAllGodsService;
    private readonly _logger;

    constructor({ getAllGodsService, logger }: GetAllGodsOperationContract) {
        this._getAllGodsService = getAllGodsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<God>>> {
        this._logger('info', 'Execute - GetAllGodsOperation');
        const gods = await this._getAllGodsService.getAll();
        return gods;
    }
}
