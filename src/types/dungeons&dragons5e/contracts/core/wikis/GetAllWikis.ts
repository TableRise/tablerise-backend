import GetAllWikisService from 'src/core/dungeons&dragons5e/services/wikis/GetAllWikisService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetAllWikisOperationContract {
    getAllWikisService: GetAllWikisService;
    logger: Logger;
}

export interface GetAllWikisServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
