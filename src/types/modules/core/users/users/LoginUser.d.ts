import LoginUserService from 'src/core/users/services/users/LoginUserService';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';

export interface LoginUserOperationContract {
    loginUserService: LoginUserService;
    logger: Logger;
}

export interface LoginUserServiceContract {
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
