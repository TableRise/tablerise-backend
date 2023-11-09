import ToggleBackgroundsAvailabilityService from 'src/core/dungeons&dragons5e/services/backgrounds/ToggleBackgroundsAvailabilityService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface ToggleBackgroundsAvailabilityOperationContract {
    toggleBackgroundsAvailabilityService: ToggleBackgroundsAvailabilityService;
    logger: Logger;
}

export interface ToggleBackgroundsAvailabilityServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
