import GetDisabledRealmsService from 'src/core/dungeons&dragons5e/services/realms/GetDisabledRealmsService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetDisabledRealmsOperationContract {
    getDisabledRealmsService: GetDisabledRealmsService;
    logger: Logger;
}

export interface GetDisabledRealmsServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
