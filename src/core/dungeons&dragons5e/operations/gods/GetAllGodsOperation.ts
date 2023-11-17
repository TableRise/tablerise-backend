import { Internacional } from '../../../../domains/dungeons&dragons5e/LanguagesWrapper';
import { God } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { GetAllGodsOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/gods/GetAllGodsOperation';

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
