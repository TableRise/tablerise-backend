import ResetProfileService from 'src/core/users/services/users/ResetProfileService';
import { StateMachineProps } from 'src/domains/common/StateMachine';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface ResetProfileOperationContract {
    resetProfileService: ResetProfileService;
    logger: Logger;
}

export interface ResetProfileServiceContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    stateMachineProps: typeof StateMachineProps;
    logger: Logger;
}
