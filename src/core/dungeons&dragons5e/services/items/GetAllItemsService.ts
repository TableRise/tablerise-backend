import { Item } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetAllItemsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/items/GetAllItemsService';

export default class GetAllItemsService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetAllItemsServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAll = this.getAll.bind(this);
    }

    public async getAll(): Promise<Array<Internacional<Item>>> {
        this.logger('info', 'GetAll - GetAllItemsService');
        this.dungeonsAndDragonsRepository.setEntity('Items');

        const itemsInDb = (await this.dungeonsAndDragonsRepository.find({
            active: true,
        })) as Array<Internacional<Item>>;
        return itemsInDb;
    }
}
