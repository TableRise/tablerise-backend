import ResetTwoFactorService from 'src/core/users/services/users/ResetTwoFactorService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import TwoFactorHandler from 'src/domains/common/helpers/TwoFactorHandler';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface ResetTwoFactorOperationContract {
    resetTwoFactorService: ResetTwoFactorService;
    logger: Logger;
}

export interface ResetTwoFactorServiceContract {
    usersRepository: UsersRepository;
    twoFactorHandler: TwoFactorHandler;
    httpRequestErrors: HttpRequestErrors;
    logger: Logger;
}
