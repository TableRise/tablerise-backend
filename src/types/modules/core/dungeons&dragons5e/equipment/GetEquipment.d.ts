import GetEquipmentService from 'src/core/dungeons&dragons5e/services/equipment/GetEquipmentService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetEquipmentOperationContract {
    getEquipmentService: GetEquipmentService;
    logger: Logger;
}

export interface GetEquipmentServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
