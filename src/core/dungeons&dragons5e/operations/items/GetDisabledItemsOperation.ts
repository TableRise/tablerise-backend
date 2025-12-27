import { Item } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledItemsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/items/GetDisabledItemsOperation';

export default class GetDisabledItemsOperation {
    private readonly getDisabledItemsService;
    private readonly logger;

    constructor({ getDisabledItemsService, logger }: GetDisabledItemsOperationContract) {
        this.getDisabledItemsService = getDisabledItemsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Item>>> {
        this.logger('info', 'Execute - GetItemOperation');
        const items = await this.getDisabledItemsService.getAllDisabled();
        return items;
    }
}
