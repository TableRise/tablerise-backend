import GetDisabledWikisService from 'src/core/dungeons&dragons5e/services/wikis/GetDisabledWikisService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetDisabledWikisOperationContract {
    getDisabledWikisService: GetDisabledWikisService;
    logger: Logger;
}

export interface GetDisabledWikisServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
