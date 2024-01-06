import GetDisabledGodsService from 'src/core/dungeons&dragons5e/services/gods/GetDisabledGodsService';
import { Logger } from 'src/types/shared/logger';

export interface GetDisabledGodsOperationContract {
    getDisabledGodsService: GetDisabledGodsService;
    logger: Logger;
}
