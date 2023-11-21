import GetAllWeaponssService from 'src/core/dungeons&dragons5e/services/Weaponss/GetAllWeaponsService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetAllWeaponsOperationContract {
    getAllWeaponssService: GetAllWeaponssService;
    logger: Logger;
}

export interface GetAllWeaponssServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
