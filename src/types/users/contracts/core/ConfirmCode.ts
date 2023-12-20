import ConfirmCodeService from 'src/core/users/services/users/ConfirmCodeService';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/Logger';

export interface ConfirmCodeOperationContract {
    confirmCodeService: ConfirmCodeService;
    logger: Logger;
}

export interface ConfirmCodeServiceContract {
    usersRepository: UsersRepository;
    logger: Logger;
}
