import GetSpellService from 'src/core/dungeons&dragons5e/services/spells/GetSpellService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetSpellOperationContract {
    getSpellService: GetSpellService;
    logger: Logger;
}

export interface GetSpellServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
