import { Item } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetItemOperationContract } from 'src/types/modules/core/dungeons&dragons5e/items/GetItemOperation';

export default class GetItemOperation {
    private readonly getItemService;
    private readonly logger;

    constructor({ getItemService, logger }: GetItemOperationContract) {
        this.getItemService = getItemService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<Item>> {
        this.logger('info', 'Execute - GetItemOperation');
        const item = await this.getItemService.get(id);
        return item;
    }
}
