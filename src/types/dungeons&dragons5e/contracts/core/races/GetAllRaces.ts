import GetAllRacesService from 'src/core/dungeons&dragons5e/services/races/GetAllRacesService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetAllRacesOperationContract {
    getAllRacesService: GetAllRacesService;
    logger: Logger;
}

export interface GetAllRacesServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
