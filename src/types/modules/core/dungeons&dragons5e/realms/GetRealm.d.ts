import GetRealmService from 'src/core/dungeons&dragons5e/services/realms/GetRealmService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetRealmOperationContract {
    getRealmService: GetRealmService;
    logger: Logger;
}

export interface GetRealmServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
