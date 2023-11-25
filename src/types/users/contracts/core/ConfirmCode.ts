import ConfirmCodeService from 'src/core/users/services/users/ConfirmCodeService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/Logger';

export interface ConfirmCodeOperationContract {
    confirmCodeService: ConfirmCodeService;
    logger: Logger;
}

export interface ConfirmCodeServiceContract {
    httpRequestErrors: HttpRequestErrors;
    usersRepository: UsersRepository;
    logger: Logger;
}
