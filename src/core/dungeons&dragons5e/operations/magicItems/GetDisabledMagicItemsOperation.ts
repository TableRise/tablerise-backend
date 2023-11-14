import { MagicItem } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { GetDisabledMagicItemsOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/magicItems/GetDisabledMagicItems';

export default class GetDisabledMagicItemsOperation {
    private readonly _getDisabledMagicItemsService;
    private readonly _logger;

    constructor({
        getDisabledMagicItemsService,
        logger,
    }: GetDisabledMagicItemsOperationContract) {
        this._getDisabledMagicItemsService = getDisabledMagicItemsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<MagicItem>>> {
        this._logger('info', 'Execute - GetMagicItemOperation');
        const magicItems = await this._getDisabledMagicItemsService.getAllDisabled();
        return magicItems;
    }
}
