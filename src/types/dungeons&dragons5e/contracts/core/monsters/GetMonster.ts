import GetMonsterService from 'src/core/dungeons&dragons5e/services/monsters/GetMonsterService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetMonsterOperationContract {
    getMonsterService: GetMonsterService;
    logger: Logger;
}

export interface GetMonsterServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
