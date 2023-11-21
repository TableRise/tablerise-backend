import GetWikiService from 'src/core/dungeons&dragons5e/services/Wikis/GetwikiService';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetwikiOperationContract {
    getwikiService: GetWikiService;
    logger: Logger;
}

export interface GetwikiServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
