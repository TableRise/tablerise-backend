import GetUsersService from 'src/core/users/services/users/GetUsersService';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetUsersOperationContract {
    getUsersService: GetUsersService;
    logger: Logger;
}

export interface GetUsersServiceContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
