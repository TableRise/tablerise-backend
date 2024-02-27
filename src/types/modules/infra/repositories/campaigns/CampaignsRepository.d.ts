import DatabaseManagement from '@tablerise/database-management';
import { Logger } from 'src/types/shared/logger';

export interface UsersDetailsRepositoryContract {
    database: DatabaseManagement;
    logger: Logger;
}
