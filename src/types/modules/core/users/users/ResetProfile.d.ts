import ResetProfileService from 'src/core/users/services/users/ResetProfileService';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';

export interface ResetProfileOperationContract {
    resetProfileService: ResetProfileService;
    logger: Logger;
}

export interface ResetProfileServiceContract {
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
