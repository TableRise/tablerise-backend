import GetDisabledGodsService from 'src/core/dungeons&dragons5e/services/gods/GetDisabledGodsService';
import { Logger } from 'src/types/Logger';

export interface GetDisabledGodsOperationContract {
    getDisabledGodsService: GetDisabledGodsService;
    logger: Logger;
}
