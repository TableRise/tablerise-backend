import ToggleWeaponsAvailabilityService from 'src/core/dungeons&dragons5e/services/weapons/ToggleWeaponsAvailabilityService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface ToggleWeaponsAvailabilityOperationContract {
    toggleWeaponsAvailabilityService: ToggleWeaponsAvailabilityService;
    logger: Logger;
}

export interface ToggleWeaponsAvailabilityServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
