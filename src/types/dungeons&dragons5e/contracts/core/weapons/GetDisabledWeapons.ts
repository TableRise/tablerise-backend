import GetDisabledWeaponssService from 'src/core/dungeons&dragons5e/services/Weaponss/GetDisabledWeaponsService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetDisabledWeaponsOperationContract {
    getDisabledWeaponssService: GetDisabledWeaponssService;
    logger: Logger;
}

export interface GetDisabledWeaponsServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
