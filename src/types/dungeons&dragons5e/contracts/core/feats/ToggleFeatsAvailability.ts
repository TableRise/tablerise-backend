import ToggleFeatsAvailabilityService from 'src/core/dungeons&dragons5e/services/feats/ToggleFeatsAvailabilityService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface ToggleFeatsAvailabilityOperationContract {
    toggleFeatsAvailabilityService: ToggleFeatsAvailabilityService;
    logger: Logger;
}

export interface ToggleFeatsAvailabilityServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
