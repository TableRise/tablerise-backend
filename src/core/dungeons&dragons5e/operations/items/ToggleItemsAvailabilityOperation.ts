import { Item } from 'src/domains/dungeons&dragons5e/DungeonsAndDragons5EInterfaces';
import { Internacional } from 'src/domains/dungeons&dragons5e/LanguagesWrapper';
import { ToggleItemsAvailabilityOperationContract } from 'src/types/dungeons&dragons5e/contracts/core/items/ToggleItemsAvailabilityOperation';
import { AvailabilityPayload } from 'src/types/dungeons&dragons5e/requests/Payload';

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
