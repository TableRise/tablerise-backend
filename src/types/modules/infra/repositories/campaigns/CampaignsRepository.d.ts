import DatabaseManagement from '@tablerise/database-management';
import Serializer from 'src/domains/campaigns/helpers/Serializer';
import { Logger } from 'src/types/shared/logger';

export interface UsersRepositoryContract {
    database: DatabaseManagement;
    serializer: Serializer;
    logger: Logger;
}
