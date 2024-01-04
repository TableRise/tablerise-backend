import ConfirmEmailService from 'src/core/users/services/users/ConfirmEmailService';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/Logger';

export interface ConfirmEmailOperationContract {
    confirmEmailService: ConfirmEmailService;
    logger: Logger;
}

export interface ConfirmEmailServiceContract {
    usersRepository: UsersRepository;
    logger: Logger;
}
