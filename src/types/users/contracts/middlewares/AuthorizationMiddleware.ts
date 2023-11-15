import TwoFactorHandler from 'src/infra/helpers/common/TwoFactorHandler';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/Logger';

export interface AuthorizationMiddlewareContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    twoFactorHandler: TwoFactorHandler;
    logger: Logger;
}
