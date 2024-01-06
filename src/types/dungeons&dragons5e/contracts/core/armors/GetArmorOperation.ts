import GetArmorService from 'src/core/dungeons&dragons5e/services/armors/GetArmorService';
import { Logger } from 'src/types/shared/logger';

export interface GetArmorOperationContract {
    getArmorService: GetArmorService;
    logger: Logger;
}
