import DatabaseManagement, { MongoModel } from '@tablerise/database-management';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import Serializer from 'src/infra/helpers/user/Serializer';
import { Logger } from 'src/types/Logger';

export abstract class UsersRepositoryContract {
    database: DatabaseManagement;
    httpRequestErrors: HttpRequestErrors;
    model: MongoModel<UserInstance>;
    serializer: Serializer;
    logger: Logger;
}
