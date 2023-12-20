import GetAllFeatsService from 'src/core/dungeons&dragons5e/services/feats/GetAllFeatsService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetAllFeatsOperationContract {
    getAllFeatsService: GetAllFeatsService;
    logger: Logger;
}

export interface GetAllFeatsServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
