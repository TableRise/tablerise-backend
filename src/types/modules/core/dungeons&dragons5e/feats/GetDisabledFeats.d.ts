import GetDisabledFeatsService from 'src/core/dungeons&dragons5e/services/feats/GetDisabledFeatsService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetDisabledFeatsOperationContract {
    getDisabledFeatsService: GetDisabledFeatsService;
    logger: Logger;
}

export interface GetDisabledFeatsServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
