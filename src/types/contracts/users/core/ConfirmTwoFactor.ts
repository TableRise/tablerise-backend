import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/Logger';

export interface ConfirmTwoFactorOperationContract {
    logger: Logger
}

export interface ConfirmTwoFactorServiceContract {
    usersRepository: UsersRepository;
    logger: Logger
}
