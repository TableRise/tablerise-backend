import GetAllEquipmentService from 'src/core/dungeons&dragons5e/services/equipment/GetAllEquipmentService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetAllEquipmentOperationContract {
    getAllEquipmentService: GetAllEquipmentService;
    logger: Logger;
}

export interface GetAllEquipmentServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
