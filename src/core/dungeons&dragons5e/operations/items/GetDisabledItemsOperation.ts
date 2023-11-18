import { Item } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetDisabledItemsOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/items/GetDisabledItemsOperation';

export default class GetDisabledItemsOperation {
    private readonly _getDisabledItemsService;
    private readonly _logger;

    constructor({ getDisabledItemsService, logger }: GetDisabledItemsOperationContract) {
        this._getDisabledItemsService = getDisabledItemsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Item>>> {
        this._logger('info', 'Execute - GetItemOperation');
        const items = await this._getDisabledItemsService.getAllDisabled();
        return items;
    }
}
