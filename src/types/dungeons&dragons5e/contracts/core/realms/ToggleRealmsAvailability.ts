import ToggleRealmsAvailabilityService from 'src/core/dungeons&dragons5e/services/realms/ToggleRealmsAvailabilityService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface ToggleRealmsAvailabilityOperationContract {
    toggleRealmsAvailabilityService: ToggleRealmsAvailabilityService;
    logger: Logger;
}

export interface ToggleRealmsAvailabilityServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
