import GetAllMonstersService from 'src/core/dungeons&dragons5e/services/monsters/GetAllMonstersService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetAllMonstersOperationContract {
    getAllMonstersService: GetAllMonstersService;
    logger: Logger;
}

export interface GetAllMonstersServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
