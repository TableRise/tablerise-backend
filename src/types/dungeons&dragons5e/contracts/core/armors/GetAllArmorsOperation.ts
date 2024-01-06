import GetAllArmorsService from 'src/core/dungeons&dragons5e/services/armors/GetAllArmorsService';
import { Logger } from 'src/types/shared/logger';

export interface GetAllArmorsOperationContract {
    getAllArmorsService: GetAllArmorsService;
    logger: Logger;
}
