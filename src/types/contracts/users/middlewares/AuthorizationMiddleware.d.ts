import { MongoModel } from '@tablerise/database-management';
import { UserDetail } from 'src/domains/user/schemas/userDetailsValidationSchema';
import { User } from 'src/domains/user/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { Logger } from 'src/types/Logger';

export abstract class AuthorizationMiddlewareContract {
    usersModel: MongoModel<User>;
    usersDetailsModel: MongoModel<UserDetail>;
    httpRequestErrors: HttpRequestErrors;
    logger: Logger;
}
