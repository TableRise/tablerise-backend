import { Item } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetItemServiceContract } from 'src/types/modules/core/dungeons&dragons5e/items/GetItemService';

export default class GetItemService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetItemServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.get = this.get.bind(this);
    }

    public async get(id: string): Promise<Internacional<Item>> {
        this.logger('info', 'GetAll - GetItemService');
        this.dungeonsAndDragonsRepository.setEntity('Items');

        const itemInDb = (await this.dungeonsAndDragonsRepository.findOne({
            itemId: id,
        })) as Internacional<Item>;
        return itemInDb;
    }
}
