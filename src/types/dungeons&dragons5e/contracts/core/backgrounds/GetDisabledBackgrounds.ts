import GetDisabledBackgroundsService from 'src/core/dungeons&dragons5e/services/backgrounds/GetDisabledBackgroundsService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetDisabledBackgroundsOperationContract {
    getDisabledBackgroundsService: GetDisabledBackgroundsService;
    logger: Logger;
}

export interface GetDisabledBackgroundsServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
