import { MagicItem } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetMagicItemOperationContract } from 'src/types/modules/core/dungeons&dragons5e/magicItems/GetMagicItem';

export default class GetMagicItemOperation {
    private readonly _getMagicItemService;
    private readonly _logger;

    constructor({ getMagicItemService, logger }: GetMagicItemOperationContract) {
        this._getMagicItemService = getMagicItemService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(id: string): Promise<Internacional<MagicItem>> {
        this._logger('info', 'Execute - GetMagicItemOperation');
        const magicItem = await this._getMagicItemService.get(id);
        return magicItem;
    }
}
