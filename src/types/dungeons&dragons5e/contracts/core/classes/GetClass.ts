import GetClassService from 'src/core/dungeons&dragons5e/services/classes/GetClassService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetClassOperationContract {
    getClassService: GetClassService;
    logger: Logger;
}

export interface GetClassServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
