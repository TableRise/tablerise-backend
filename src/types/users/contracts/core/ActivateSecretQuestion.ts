import ActivateSecretQuestionService from 'src/core/users/services/users/ActivateSecretQuestionService';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/Logger';

export interface ActivateSecretQuestionOperationContract {
    activateSecretQuestionService: ActivateSecretQuestionService;
    logger: Logger;
}

export interface ActivateSecretQuestionServiceContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
