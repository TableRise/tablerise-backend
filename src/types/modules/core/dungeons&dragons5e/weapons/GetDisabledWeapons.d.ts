import GetDisabledWeaponsService from 'src/core/dungeons&dragons5e/services/weapons/GetDisabledWeaponsService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetDisabledWeaponsOperationContract {
    getDisabledWeaponsService: GetDisabledWeaponsService;
    logger: Logger;
}

export interface GetDisabledWeaponsServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
