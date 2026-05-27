import GetDisabledEquipmentService from 'src/core/dungeons&dragons5e/services/equipment/GetDisabledEquipmentService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetDisabledEquipmentOperationContract {
    getDisabledEquipmentService: GetDisabledEquipmentService;
    logger: Logger;
}

export interface GetDisabledEquipmentServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
