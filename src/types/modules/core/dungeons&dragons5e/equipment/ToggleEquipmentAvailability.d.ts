import ToggleEquipmentAvailabilityService from 'src/core/dungeons&dragons5e/services/equipment/ToggleEquipmentAvailabilityService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface ToggleEquipmentAvailabilityOperationContract {
    toggleEquipmentAvailabilityService: ToggleEquipmentAvailabilityService;
    logger: Logger;
}

export interface ToggleEquipmentAvailabilityServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
