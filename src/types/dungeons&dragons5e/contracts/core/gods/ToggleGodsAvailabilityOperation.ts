import ToggleGodsAvailabilityService from 'src/core/dungeons&dragons5e/services/gods/ToggleGodsAvailabilityService';
import { Logger } from 'src/types/Logger';

export interface ToggleGodsAvailabilityOperationContract {
    toggleGodsAvailabilityService: ToggleGodsAvailabilityService;
    logger: Logger;
}
