import { Item } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleItemsAvailabilityServiceContract } from 'src/types/modules/core/dungeons&dragons5e/items/ToggleItemsAvailabilityService';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleItemsAvailabilityService {
    private readonly dungeonsAndDragonsRepository;
    private readonly logger;

    constructor({ dungeonsAndDragonsRepository, logger }: ToggleItemsAvailabilityServiceContract) {
        this.dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this.logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({ id, availability }: AvailabilityPayload): Promise<Internacional<Item>> {
        this.logger('info', 'Toggle - ToggleItemsAvailabilityService');
        this.dungeonsAndDragonsRepository.setEntity('Items');

        const itemInDb = (await this.dungeonsAndDragonsRepository.findOne({
            itemId: id,
        })) as Internacional<Item>;

        itemInDb.active = availability;

        await this.dungeonsAndDragonsRepository.update({
            query: { itemId: id },
            payload: itemInDb,
        });

        return itemInDb;
    }
}
