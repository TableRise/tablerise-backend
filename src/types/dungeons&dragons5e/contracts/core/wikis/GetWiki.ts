import GetWikiService from 'src/core/dungeons&dragons5e/services/wikis/GetWikiService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetWikiOperationContract {
    getWikiService: GetWikiService;
    logger: Logger;
}

export interface GetWikiServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
