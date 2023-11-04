import DatabaseManagement, { MongoModel } from '@tablerise/database-management';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import Serializer from 'src/infra/helpers/user/Serializer';
import UpdateTimestampRepository from 'src/infra/repositories/user/UpdateTimestampRepository';
import { Logger } from 'src/types/Logger';

export interface UsersRepositoryContract {
    database: DatabaseManagement;
    updateTimestampRepository: UpdateTimestampRepository;
    httpRequestErrors: HttpRequestErrors;
    model: MongoModel<UserInstance>;
    serializer: Serializer;
    logger: Logger;
}
