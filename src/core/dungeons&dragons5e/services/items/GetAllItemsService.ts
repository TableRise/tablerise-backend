import { Item } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllItemsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/items/GetAllItemsService';

export default class GetAllItemsService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllItemsServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<Item>>> {
        this._logger('info', 'GetAll - GetAllItemsService');
        this._dungeonsAndDragonsRepository.setEntity('Items');

        const itemsInDb = (await this._dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<Item>>;
        return itemsInDb;
    }
}
