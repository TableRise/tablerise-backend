import DatabaseManagement from '@tablerise/database-management';
import { Logger } from 'src/types/Logger';

export interface TokenForbiddenContract {
    databaseConnect: typeof DatabaseManagement.connect;
    logger: Logger;
}
