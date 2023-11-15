import GetDisabledSpellsService from 'src/core/dungeons&dragons5e/services/spells/GetDisabledSpellsService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetDisabledSpellsOperationContract {
    getDisabledSpellsService: GetDisabledSpellsService;
    logger: Logger;
}

export interface GetDisabledSpellsServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
