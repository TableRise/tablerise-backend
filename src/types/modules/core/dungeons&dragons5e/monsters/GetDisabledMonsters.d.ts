import GetDisabledMonstersService from 'src/core/dungeons&dragons5e/services/monsters/GetDisabledMonstersService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetDisabledMonstersOperationContract {
    getDisabledMonstersService: GetDisabledMonstersService;
    logger: Logger;
}

export interface GetDisabledMonstersServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
