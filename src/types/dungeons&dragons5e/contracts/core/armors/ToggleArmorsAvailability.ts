import ToggleArmorsAvailabilityService from 'src/core/dungeons&dragons5e/services/armors/ToggleArmorsAvailabilityService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface ToggleArmorsAvailabilityOperationContract {
    toggleArmorsAvailabilityService: ToggleArmorsAvailabilityService;
    logger: Logger;
}

export interface ToggleArmorsAvailabilityServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
