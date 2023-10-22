import ActivateTwoFactorService from 'src/core/users/services/ActivateTwoFactorService';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/Logger';

export interface ActivateTwoFactorOperationContract {
    activateTwoFactorService: ActivateTwoFactorService;
    logger: Logger;
}

export interface ActivateTwoFactorServiceContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    httpRequestErrors: HttpRequestErrors;
    logger: Logger;
}
