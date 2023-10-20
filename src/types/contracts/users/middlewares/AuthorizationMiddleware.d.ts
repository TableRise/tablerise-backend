import { MongoModel } from '@tablerise/database-management';
import { UserDetail } from 'src/interface/users/schemas/userDetailsValidationSchema';
import { User } from 'src/interface/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';
import { Logger } from 'src/types/Logger';

export abstract class AuthorizationMiddlewareContract {
    usersModel: MongoModel<User>;
    usersDetailsModel: MongoModel<UserDetail>;
    httpRequestErrors: HttpRequestErrors;
    logger: Logger;
}
