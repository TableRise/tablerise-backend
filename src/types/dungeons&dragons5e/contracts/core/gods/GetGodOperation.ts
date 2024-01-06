import GetGodService from 'src/core/dungeons&dragons5e/services/gods/GetGodService';
import { Logger } from 'src/types/shared/logger';

export interface GetGodOperationContract {
    getGodService: GetGodService;
    logger: Logger;
}
