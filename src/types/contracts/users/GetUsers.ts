import GetUsersService from 'src/core/users/services/GetUsersService';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/Logger';

export interface GetUsersOperationContract {
    getUsersService: GetUsersService;
    logger: Logger;
}

export interface GetUsersServiceContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
