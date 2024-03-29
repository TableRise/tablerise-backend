import { Item } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetItemServiceContract } from 'src/types/modules/core/dungeons&dragons5e/items/GetItemService';

export default class GetItemService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetItemServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Item>> {
        this._logger('info', 'GetAll - GetItemService');
        this._dungeonsAndDragonsRepository.setEntity('Items');

        const itemInDb = (await this._dungeonsAndDragonsRepository.findOne({
            itemId: id,
        })) as Internacional<Item>;
        return itemInDb;
    }
}
