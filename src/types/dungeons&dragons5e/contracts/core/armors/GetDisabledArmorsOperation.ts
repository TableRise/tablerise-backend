import GetDisabledArmorsService from 'src/core/dungeons&dragons5e/services/armors/GetDisabledArmorsService';
import { Logger } from 'src/types/shared/logger';

export interface GetDisabledArmorsOperationContract {
    getDisabledArmorsService: GetDisabledArmorsService;
    logger: Logger;
}
