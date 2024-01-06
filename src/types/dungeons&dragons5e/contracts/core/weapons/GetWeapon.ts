import GetWeaponService from 'src/core/dungeons&dragons5e/services/weapons/GetWeaponService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetWeaponOperationContract {
    getWeaponService: GetWeaponService;
    logger: Logger;
}

export interface GetWeaponServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
