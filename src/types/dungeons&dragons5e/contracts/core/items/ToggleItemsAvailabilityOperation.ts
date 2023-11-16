import ToggleItemsAvailabilityService from 'src/core/dungeons&dragons5e/services/items/ToggleItemsAvailabilityService';
import { Logger } from 'src/types/Logger';

export interface ToggleItemsAvailabilityOperationContract {
    toggleItemsAvailabilityService: ToggleItemsAvailabilityService;
    logger: Logger;
}
