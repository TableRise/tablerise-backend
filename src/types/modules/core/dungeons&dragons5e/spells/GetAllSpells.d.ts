import GetAllSpellsService from 'src/core/dungeons&dragons5e/services/spells/GetAllSpellsService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetAllSpellsOperationContract {
    getAllSpellsService: GetAllSpellsService;
    logger: Logger;
}

export interface GetAllSpellsServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
