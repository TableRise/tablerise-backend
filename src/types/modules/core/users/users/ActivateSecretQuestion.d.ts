import ActivateSecretQuestionService from 'src/core/users/services/users/ActivateSecretQuestionService';
import { StateMachineProps } from 'src/domains/common/StateMachine';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface ActivateSecretQuestionOperationContract {
    activateSecretQuestionService: ActivateSecretQuestionService;
    logger: Logger;
}

export interface ActivateSecretQuestionServiceContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    stateMachineProps: typeof StateMachineProps;
    logger: Logger;
}
