import DatabaseManagement from '@tablerise/database-management';
import { Logger } from 'src/types/Logger';

export interface UpdateTimestampRepositoryContract {
    database: DatabaseManagement;
    logger: Logger;
}
