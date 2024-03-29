import GetDisabledMagicItemsService from 'src/core/dungeons&dragons5e/services/magicItems/GetDisabledMagicItemsService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetDisabledMagicItemsOperationContract {
    getDisabledMagicItemsService: GetDisabledMagicItemsService;
    logger: Logger;
}

export interface GetDisabledMagicItemsServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
