import ConfirmCodeService from 'src/core/users/services/ConfirmCodeService';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
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
