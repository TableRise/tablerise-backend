import GetItemService from 'src/core/dungeons&dragons5e/services/items/GetItemService';
import { Logger } from 'src/types/shared/logger';

export interface GetItemOperationContract {
    getItemService: GetItemService;
    logger: Logger;
}
