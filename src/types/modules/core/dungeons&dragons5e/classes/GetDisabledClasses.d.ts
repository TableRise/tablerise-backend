import GetDisabledClassesService from 'src/core/dungeons&dragons5e/services/classes/GetDisabledClassesService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetDisabledClassesOperationContract {
    getDisabledClassesService: GetDisabledClassesService;
    logger: Logger;
}

export interface GetDisabledClassesServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
