import { Item } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledItemsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/items/GetDisabledItemsService';

export default class GetDisabledItemsService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetDisabledItemsServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<Item>>> {
        this._logger('info', 'GetAll - GetDisabledItemsService');
        this._dungeonsAndDragonsRepository.setEntity('Items');

        const itemInDb = (await this._dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<Item>>;
        return itemInDb;
    }
}
