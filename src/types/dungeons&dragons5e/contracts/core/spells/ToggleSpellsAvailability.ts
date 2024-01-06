import ToggleSpellsAvailabilityService from 'src/core/dungeons&dragons5e/services/spells/ToggleSpellsAvailabilityService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface ToggleSpellsAvailabilityOperationContract {
    toggleSpellsAvailabilityService: ToggleSpellsAvailabilityService;
    logger: Logger;
}

export interface ToggleSpellsAvailabilityServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
