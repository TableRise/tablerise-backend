import ToggleGodsAvailabilityService from 'src/core/dungeons&dragons5e/services/gods/ToggleGodsAvailabilityService';
import { Logger } from 'src/types/shared/logger';

export interface ToggleGodsAvailabilityOperationContract {
    toggleGodsAvailabilityService: ToggleGodsAvailabilityService;
    logger: Logger;
}
