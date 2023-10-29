import ResetTwoFactorService from 'src/core/users/services/users/ResetTwoFactorService';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/Logger';

export interface ResetTwoFactorOperationContract {
    resetTwoFactorService: ResetTwoFactorService;
    logger: Logger;
}

export interface ResetTwoFactorServiceContract {
    usersRepository: UsersRepository;
    httpRequestErrors: HttpRequestErrors;
    logger: Logger;
}
