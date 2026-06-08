import GetUserByNicknameAndTagService from 'src/core/users/services/users/GetUserByNicknameAndTagService';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface GetUserByNicknameAndTagOperationContract {
    getUserByNicknameAndTagService: GetUserByNicknameAndTagService;
    logger: Logger;
}

export interface GetUserByNicknameAndTagServiceContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
