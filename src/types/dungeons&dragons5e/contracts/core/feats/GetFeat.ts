import GetFeatService from 'src/core/dungeons&dragons5e/services/feats/GetFeatService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetFeatOperationContract {
    getFeatService: GetFeatService;
    logger: Logger;
}

export interface GetFeatServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
