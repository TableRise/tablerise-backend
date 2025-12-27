import { MagicItem } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetMagicItemOperationContract } from 'src/types/modules/core/dungeons&dragons5e/magicItems/GetMagicItem';

export default class GetMagicItemOperation {
    private readonly getMagicItemService;
    private readonly logger;

    constructor({ getMagicItemService, logger }: GetMagicItemOperationContract) {
        this.getMagicItemService = getMagicItemService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<MagicItem>> {
        this.logger('info', 'Execute - GetMagicItemOperation');
        const magicItem = await this.getMagicItemService.get(id);
        return magicItem;
    }
}
