import GetByLevelSpellsService from 'src/core/dungeons&dragons5e/services/spells/GetByLevelSpellsService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetByLevelSpellsOperationContract {
    getByLevelSpellsService: GetByLevelSpellsService;
    logger: Logger;
}

export interface GetByLevelSpellsServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
