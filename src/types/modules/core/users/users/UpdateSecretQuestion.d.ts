import UpdateSecretQuestionService from 'src/core/users/services/users/UpdateSecretQuestionService';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/Logger';

export interface UpdateSecretQuestionOperationContract {
    updateSecretQuestionService: UpdateSecretQuestionService;
    logger: Logger;
}

export interface UpdateSecretQuestionServiceContract {
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
