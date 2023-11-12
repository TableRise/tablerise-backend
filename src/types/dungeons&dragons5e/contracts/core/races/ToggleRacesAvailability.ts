import ToggleRacesAvailabilityService from 'src/core/dungeons&dragons5e/services/races/ToggleRacesAvailabilityService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface ToggleRacesAvailabilityOperationContract {
    toggleRacesAvailabilityService: ToggleRacesAvailabilityService;
    logger: Logger;
}

export interface ToggleRacesAvailabilityServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
