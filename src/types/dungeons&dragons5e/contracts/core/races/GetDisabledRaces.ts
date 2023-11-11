import GetDisabledRacesService from 'src/core/dungeons&dragons5e/services/races/GetDisabledRacesService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetDisabledRacesOperationContract {
    getDisabledRacesService: GetDisabledRacesService;
    logger: Logger;
}

export interface GetDisabledRacesServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
