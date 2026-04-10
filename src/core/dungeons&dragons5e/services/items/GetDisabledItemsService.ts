import { Item } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { GetDisabledItemsServiceContract } from 'src/types/modules/core/dungeons&dragons5e/items/GetDisabledItemsService';

export default class GetDisabledItemsService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: GetDisabledItemsServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.getAllDisabled = this.getAllDisabled.bind(this);
    }

    public async getAllDisabled(): Promise<Array<Internacional<Item>>> {
        this.logger('info', 'GetAll - GetDisabledItemsService');
        this.dungeonsAndDragonsRepository.setEntity('Items');

        const itemInDb = (await this.dungeonsAndDragonsRepository.find({
            active: false,
        })) as Array<Internacional<Item>>;
        return itemInDb;
    }
}
