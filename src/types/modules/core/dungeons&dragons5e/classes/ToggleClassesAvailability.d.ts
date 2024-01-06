import ToggleClassesAvailabilityService from 'src/core/dungeons&dragons5e/services/classes/ToggleClassesAvailabilityService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface ToggleClassesAvailabilityOperationContract {
    toggleClassesAvailabilityService: ToggleClassesAvailabilityService;
    logger: Logger;
}

export interface ToggleClassesAvailabilityServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
