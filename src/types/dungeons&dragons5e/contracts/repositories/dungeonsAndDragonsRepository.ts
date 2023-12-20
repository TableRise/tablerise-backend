import DatabaseManagement from '@tablerise/database-management';
import { Logger } from 'src/types/Logger';

export interface DungeonsAndDragonsRepositoryContract {
    database: DatabaseManagement;
    logger: Logger;
}
