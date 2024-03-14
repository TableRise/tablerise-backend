import DatabaseManagement from '@tablerise/database-management';
import { Logger } from 'src/types/shared/logger';

export interface UpdateTimestampRepositoryContract {
    database: DatabaseManagement;
    logger: Logger;
}
