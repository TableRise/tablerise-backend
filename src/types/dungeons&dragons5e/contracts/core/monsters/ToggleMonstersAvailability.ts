import ToggleMonstersAvailabilityService from 'src/core/dungeons&dragons5e/services/monsters/ToggleMonstersAvailabilityService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface ToggleMonstersAvailabilityOperationContract {
    toggleMonstersAvailabilityService: ToggleMonstersAvailabilityService;
    logger: Logger;
}

export interface ToggleMonstersAvailabilityServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
