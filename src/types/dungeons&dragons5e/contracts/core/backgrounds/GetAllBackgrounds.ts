import GetAllBackgroundsService from 'src/core/dungeons&dragons5e/services/backgrounds/GetAllBackgroundsService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetAllBackgroundsOperationContract {
    getAllBackgroundsService: GetAllBackgroundsService;
    logger: Logger;
}

export interface GetAllBackgroundsServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
