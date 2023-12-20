import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/Logger';

export interface GetArmorServiceContract {
    dungeonsAndDragonsRepository: DungeonsAndDragonsRepository;
    logger: Logger;
}
