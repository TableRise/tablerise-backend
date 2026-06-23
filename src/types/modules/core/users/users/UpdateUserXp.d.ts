import { Logger } from 'src/types/shared/logger';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UpdateUserXpOperation from 'src/core/users/operations/users/UpdateUserXpOperation';
import UpdateUserXpService from 'src/core/users/services/users/UpdateUserXpService';

export interface UpdateUserXpOperationContract {
    updateUserXpService: UpdateUserXpService;
    logger: Logger;
}

export interface UpdateUserXpServiceContract {
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
