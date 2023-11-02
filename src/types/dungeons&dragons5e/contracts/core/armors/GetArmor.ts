import GetArmorService from 'src/core/dungeons&dragons5e/services/armors/GetArmorService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetArmorOperationContract {
    getArmorService: GetArmorService;
    logger: Logger
}

export interface GetArmorServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger
}
