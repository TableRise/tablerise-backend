import ActivateTwoFactorService from 'src/core/users/services/users/ActivateTwoFactorService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import TwoFactorHandler from 'src/domains/common/helpers/TwoFactorHandler';
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
    twoFactorHandler: TwoFactorHandler;
    httpRequestErrors: HttpRequestErrors;
    logger: Logger;
}
