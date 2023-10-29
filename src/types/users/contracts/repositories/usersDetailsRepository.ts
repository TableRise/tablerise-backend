import DatabaseManagement, { MongoModel } from '@tablerise/database-management';
import { UserDetailInstance } from 'src/domains/user/schemas/userDetailsValidationSchema';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import Serializer from 'src/infra/helpers/user/Serializer';
import { Logger } from 'src/types/Logger';

export interface UsersDetailsRepositoryContract {
    database: DatabaseManagement;
    httpRequestErrors: HttpRequestErrors;
    model: MongoModel<UserDetailInstance>;
    serializer: Serializer;
    logger: Logger;
}
