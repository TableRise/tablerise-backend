import GetAllWeaponsService from 'src/core/dungeons&dragons5e/services/weapons/GetAllWeaponsService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetAllWeaponsOperationContract {
    getAllWeaponsService: GetAllWeaponsService;
    logger: Logger;
}

export interface GetAllWeaponsServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
