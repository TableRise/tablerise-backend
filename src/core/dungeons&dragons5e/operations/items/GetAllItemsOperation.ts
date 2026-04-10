import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { Item } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { GetAllItemsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/items/GetAllItemsOperation';

export default class GetAllItemsOperation {
    private readonly getAllItemsService;
    private readonly logger;

    constructor({ getAllItemsService, logger }: GetAllItemsOperationContract) {
        this.getAllItemsService = getAllItemsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<Item>>> {
        this.logger('info', 'Execute - GetAllItemsOperation');
        const items = await this.getAllItemsService.getAll();
        return items;
    }
}
