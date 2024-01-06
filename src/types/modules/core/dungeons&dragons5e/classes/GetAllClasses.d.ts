import GetAllClassesService from 'src/core/dungeons&dragons5e/services/classes/GetAllClassesService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetAllClassesOperationContract {
    getAllClassesService: GetAllClassesService;
    logger: Logger;
}

export interface GetAllClassesServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
