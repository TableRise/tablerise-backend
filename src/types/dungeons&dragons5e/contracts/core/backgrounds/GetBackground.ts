import GetBackgroundService from 'src/core/dungeons&dragons5e/services/backgrounds/GetBackgroundService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetBackgroundOperationContract {
    getBackgroundService: GetBackgroundService;
    logger: Logger;
}

export interface GetBackgroundServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
