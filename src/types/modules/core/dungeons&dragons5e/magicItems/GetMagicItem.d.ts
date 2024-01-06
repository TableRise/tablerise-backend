import GetMagicItemService from 'src/core/dungeons&dragons5e/services/magicItems/GetMagicItemService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetMagicItemOperationContract {
    getMagicItemService: GetMagicItemService;
    logger: Logger;
}

export interface GetMagicItemServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
