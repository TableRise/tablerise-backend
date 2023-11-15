import ToggleMagicItemsAvailabilityService from 'src/core/dungeons&dragons5e/services/magicItems/ToggleMagicItemsAvailabilityService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface ToggleMagicItemsAvailabilityOperationContract {
    toggleMagicItemsAvailabilityService: ToggleMagicItemsAvailabilityService;
    logger: Logger;
}

export interface ToggleMagicItemsAvailabilityServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
