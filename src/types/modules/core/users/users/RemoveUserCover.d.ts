import RemoveUserCoverService from 'src/core/users/services/users/RemoveUserCoverService';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';

export interface RemoveUserCoverOperationContract {
    removeUserCoverService: RemoveUserCoverService;
    logger: Logger;
}

export interface RemoveUserCoverServiceContract {
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
