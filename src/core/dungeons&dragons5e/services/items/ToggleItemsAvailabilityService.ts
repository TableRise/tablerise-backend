import { Item } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleItemsAvailabilityServiceContract } from 'src/types/modules/core/dungeons&dragons5e/items/ToggleItemsAvailabilityService';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleItemsAvailabilityService {
    private readonly _dungeonsAndDragonsRepository;
    private readonly _logger;

    constructor({ dungeonsAndDragonsRepository, logger }: ToggleItemsAvailabilityServiceContract) {
        this._dungeonsAndDragonsRepository = dungeonsAndDragonsRepository;
        this._logger = logger;

        this.toggle = this.toggle.bind(this);
    }

    public async toggle({ id, availability }: AvailabilityPayload): Promise<Internacional<Item>> {
        this._logger('info', 'Toggle - ToggleItemsAvailabilityService');
        this._dungeonsAndDragonsRepository.setEntity('Items');

        const itemInDb = (await this._dungeonsAndDragonsRepository.findOne({
            itemId: id,
        })) as Internacional<Item>;

        itemInDb.active = availability;

        await this._dungeonsAndDragonsRepository.update({
            query: { itemId: id },
            payload: itemInDb,
        });

        return itemInDb;
    }
}
