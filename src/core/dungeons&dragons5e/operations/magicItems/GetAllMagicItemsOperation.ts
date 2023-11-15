import { Internacional } from '../../../../domains/dungeons&dragons5e/LanguagesWrapper';
import { MagicItem } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { GetAllMagicItemsOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/magicItems/GetAllMagicItems';

export default class GetAllMagicItemsOperation {
    private readonly _getAllMagicItemsService;
    private readonly _logger;

    constructor({ getAllMagicItemsService, logger }: GetAllMagicItemsOperationContract) {
        this._getAllMagicItemsService = getAllMagicItemsService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(): Promise<Array<Internacional<MagicItem>>> {
        this._logger('info', 'Execute - GetAllMagicItemsOperation');
        const magicItems = await this._getAllMagicItemsService.getAll();
        return magicItems;
    }
}
