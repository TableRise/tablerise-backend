import UpdateUserService from 'src/core/users/services/users/UpdateUserService';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateUserOperationContract {
    updateUserService: UpdateUserService;
    logger: Logger;
}

export interface UpdateUserServiceContract {
    usersRepository: UsersRepository;
    logger: Logger;
}
