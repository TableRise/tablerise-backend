import DatabaseManagement from '@tablerise/database-management';
import { Logger } from 'src/types/shared/logger';

export interface DungeonsAndDragonsRepositoryContract {
    database: DatabaseManagement;
    logger: Logger;
}
