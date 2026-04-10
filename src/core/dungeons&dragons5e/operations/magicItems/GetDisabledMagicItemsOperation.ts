import { MagicItem } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledMagicItemsOperationContract } from 'src/types/modules/core/dungeons&dragons5e/magicItems/GetDisabledMagicItems';

export default class GetDisabledMagicItemsOperation {
    private readonly getDisabledMagicItemsService;
    private readonly logger;

    constructor({ getDisabledMagicItemsService, logger }: GetDisabledMagicItemsOperationContract) {
        this.getDisabledMagicItemsService = getDisabledMagicItemsService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<MagicItem>>> {
        this.logger('info', 'Execute - GetMagicItemOperation');
        const magicItems = await this.getDisabledMagicItemsService.getAllDisabled();
        return magicItems;
    }
}
