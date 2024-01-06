import GetUserByIdService from 'src/core/users/services/users/GetUserByIdService';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetUserByIdOperationContract {
    getUserByIdService: GetUserByIdService;
    logger: Logger;
}

export interface GetUserByIdServiceContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
