import DatabaseManagement, { MongoModel } from '@tablerise/database-management';
import { Logger } from 'src/types/Logger';

export interface DungeonsAndDragonsRepositoryContract {
    database: DatabaseManagement;
    model: MongoModel<unknown>;
    logger: Logger;
}
