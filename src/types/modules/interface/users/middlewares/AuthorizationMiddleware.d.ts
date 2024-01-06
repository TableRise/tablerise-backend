import TwoFactorHandler from 'src/domains/common/helpers/TwoFactorHandler';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface AuthorizationMiddlewareContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    twoFactorHandler: TwoFactorHandler;
    logger: Logger;
}
