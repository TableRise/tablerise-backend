import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { Item } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { GetAllItemsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/items/GetAllItemsOperation';

export default class GetAllItemsOperation {
    private readonly _getAllItemsService;
    private readonly _logger;

    constructor({ getAllItemsService, logger }: GetAllItemsOperationContract) {
        this._getAllItemsService = getAllItemsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Item>>> {
        this._logger('info', 'Execute - GetAllItemsOperation');
        const items = await this._getAllItemsService.getAll();
        return items;
    }
}
