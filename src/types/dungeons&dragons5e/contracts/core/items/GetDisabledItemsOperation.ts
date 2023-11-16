import GetDisabledItemsService from 'src/core/dungeons&dragons5e/services/items/GetDisabledItemsService';
import { Logger } from 'src/types/Logger';

export interface GetDisabledItemsOperationContract {
    getDisabledItemsService: GetDisabledItemsService;
    logger: Logger;
}
