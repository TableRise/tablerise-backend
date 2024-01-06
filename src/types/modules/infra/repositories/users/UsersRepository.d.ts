import DatabaseManagement from '@tablerise/database-management';
import Serializer from 'src/domains/users/helpers/Serializer';
import UpdateTimestampRepository from 'src/infra/repositories/user/UpdateTimestampRepository';
import { Logger } from 'src/types/shared/logger';

export interface UsersRepositoryContract {
    database: DatabaseManagement;
    updateTimestampRepository: UpdateTimestampRepository;
    serializer: Serializer;
    logger: Logger;
}
