import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { MagicItem } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { GetAllMagicItemsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/magicItems/GetAllMagicItems';

export default class GetAllMagicItemsOperation {
    private readonly getAllMagicItemsService;
    private readonly logger;

    constructor({ getAllMagicItemsService, logger }: GetAllMagicItemsOperationContract) {
        this.getAllMagicItemsService = getAllMagicItemsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<MagicItem>>> {
        this.logger('info', 'Execute - GetAllMagicItemsOperation');
        const magicItems = await this.getAllMagicItemsService.getAll();
        return magicItems;
    }
}
