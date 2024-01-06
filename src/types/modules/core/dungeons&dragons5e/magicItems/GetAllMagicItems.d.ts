import GetAllMagicItemsService from 'src/core/dungeons&dragons5e/services/magicItems/GetAllMagicItemsService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetAllMagicItemsOperationContract {
    getAllMagicItemsService: GetAllMagicItemsService;
    logger: Logger;
}

export interface GetAllMagicItemsServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
