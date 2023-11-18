import GetAllGodsService from 'src/core/dungeons&dragons5e/services/gods/GetAllGodsService';
import { Logger } from 'src/types/Logger';

export interface GetAllGodsOperationContract {
    getAllGodsService: GetAllGodsService;
    logger: Logger;
}
