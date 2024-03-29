import { Item } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetItemOperationContract } from 'src/types/modules/core/dungeons&dragons5e/items/GetItemOperation';

export default class GetItemOperation {
    private readonly _getItemService;
    private readonly _logger;

    constructor({ getItemService, logger }: GetItemOperationContract) {
        this._getItemService = getItemService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Item>> {
        this._logger('info', 'Execute - GetItemOperation');
        const item = await this._getItemService.get(id);
        return item;
    }
}
