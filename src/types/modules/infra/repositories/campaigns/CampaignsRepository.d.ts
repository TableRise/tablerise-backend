import DatabaseManagement from '@tablerise/database-management';
import Serializer from 'src/domains/users/helpers/Serializer';
import { Logger } from 'src/types/shared/logger';

export interface CampaignsRepositoryContract {
    database: DatabaseManagement;
    serializer: Serializer;
    logger: Logger;
}
