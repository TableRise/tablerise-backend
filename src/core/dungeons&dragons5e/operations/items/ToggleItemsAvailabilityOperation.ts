import { Item } from 'src/domains/dungeons&dragons5e/schemas/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/schemas/LanguagesWrapper';
import { ToggleItemsAvailabilityOperationContract } from 'src/types/modules/core/dungeons&dragons5e/items/ToggleItemsAvailabilityOperation';
import { AvailabilityPayload } from 'src/types/api/dungeons&dragons5e/http/payload';

export default class ToggleItemsAvailabilityOperation {
    private readonly _toggleItemsAvailabilityService;
    private readonly _logger;

    constructor({
        toggleItemsAvailabilityService,
        logger,
    }: ToggleItemsAvailabilityOperationContract) {
        this._toggleItemsAvailabilityService = toggleItemsAvailabilityService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({
        id,
        availability,
    }: AvailabilityPayload): Promise<Internacional<Item>> {
        this._logger('info', 'Execute - GetItemOperation');
        const items = await this._toggleItemsAvailabilityService.toggle({
            id,
            availability,
        });
        return items;
    }
}
