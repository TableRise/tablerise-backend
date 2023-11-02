import GetAllArmorsService from 'src/core/dungeons&dragons5e/services/armors/GetAllArmorsService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetAllArmorsOperationContract {
    getAllArmorsService: GetAllArmorsService;
    logger: Logger
}

export interface GetAllArmorsServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger
}
