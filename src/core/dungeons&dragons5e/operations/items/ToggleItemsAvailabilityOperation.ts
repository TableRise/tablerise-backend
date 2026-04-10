import { Item } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleItemsAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/items/ToggleItemsAvailabilityOperation';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleItemsAvailabilityOperation {
    private readonly toggleItemsAvailabilityService;
    private readonly logger;

    constructor({ toggleItemsAvailabilityService, logger }: ToggleItemsAvailabilityOperationContract) {
        this.toggleItemsAvailabilityService = toggleItemsAvailabilityService;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({ id, availability }: AvailabilityPayload): Promise<Internacional<Item>> {
        this.logger('info', 'Execute - GetItemOperation');
        const items = await this.toggleItemsAvailabilityService.toggle({
            id,
            availability,
        });
        return items;
    }
}
