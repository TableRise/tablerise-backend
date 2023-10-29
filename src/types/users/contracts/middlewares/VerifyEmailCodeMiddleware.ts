import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/Logger';

export interface VerifyEmailCodeMiddlewareContract {
    usersRepository: UsersRepository;
    logger: Logger
}
