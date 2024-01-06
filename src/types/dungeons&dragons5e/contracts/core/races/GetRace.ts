import GetRaceService from 'src/core/dungeons&dragons5e/services/races/GetRaceService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetRaceOperationContract {
    getRaceService: GetRaceService;
    logger: Logger;
}

export interface GetRaceServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
