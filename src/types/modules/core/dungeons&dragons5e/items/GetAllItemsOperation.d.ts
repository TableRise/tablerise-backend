import GetAllItemsService from 'src/core/dungeons&dragons5e/services/items/GetAllItemsService';
import { Logger } from 'src/types/shared/logger';

export interface GetAllItemsOperationContract {
    getAllItemsService: GetAllItemsService;
    logger: Logger;
}
