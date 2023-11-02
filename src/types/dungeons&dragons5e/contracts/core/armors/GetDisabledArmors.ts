import GetDisabledArmorsService from 'src/core/dungeons&dragons5e/services/armors/GetDisabledArmorsService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetDisabledArmorsOperationContract {
    getDisabledArmorsService: GetDisabledArmorsService;
    logger: Logger
}

export interface GetDisabledArmorsServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger
}
