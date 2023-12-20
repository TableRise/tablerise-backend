import GetItemService from 'src/core/dungeons&dragons5e/services/items/GetItemService';
import { Logger } from 'src/types/Logger';

export interface GetItemOperationContract {
    getItemService: GetItemService;
    logger: Logger;
}
