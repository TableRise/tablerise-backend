import GetAllRealmsService from 'src/core/dungeons&dragons5e/services/realms/GetAllRealmsService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetAllRealmsOperationContract {
    getAllRealmsService: GetAllRealmsService;
    logger: Logger;
}

export interface GetAllRealmsServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
