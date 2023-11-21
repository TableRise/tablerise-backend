import GetDisabledWikissService from 'src/core/dungeons&dragons5e/services/Wikiss/GetDisabledWikissService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetDisabledWikissOperationContract {
    getDisabledWikissService: GetDisabledWikissService;
    logger: Logger;
}

export interface GetDisabledWikissServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
