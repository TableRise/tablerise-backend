import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/Logger';

export interface AuthorizationMiddlewareContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    httpRequestErrors: HttpRequestErrors;
    logger: Logger;
}
