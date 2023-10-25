import ResetProfileService from 'src/core/users/services/ResetProfileService';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/Logger';

export interface ResetProfileOperationContract {
    resetProfileService: ResetProfileService;
    logger: Logger
}

export interface ResetProfileServiceContract {
    userDetailsRepository: UsersDetailsRepository;
    logger: Logger
}
