import GetDisabledArmorsService from 'src/core/dungeons&dragons5e/services/armors/GetDisabledArmorsService';
import { Logger } from 'src/types/Logger';

export interface GetDisabledArmorsOperationContract {
    getDisabledArmorsService: GetDisabledArmorsService;
    logger: Logger;
}
