import ToggleArmorsAvailabilityService from 'src/core/dungeons&dragons5e/services/armors/ToggleArmorsAvailabilityService';
import { Logger } from 'src/types/Logger';

export interface ToggleArmorsAvailabilityOperationContract {
    toggleArmorsAvailabilityService: ToggleArmorsAvailabilityService;
    logger: Logger;
}
