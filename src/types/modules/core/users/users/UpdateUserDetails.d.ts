import UpdateUserDetailsService from 'src/core/users/services/users/UpdateUserDetailsService';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateUserDetailsOperationContract {
    updateUserDetailsService: UpdateUserDetailsService;
    logger: Logger;
}

export interface UpdateUserDetailsServiceContract {
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
