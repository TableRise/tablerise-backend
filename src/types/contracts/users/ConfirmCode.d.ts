import ConfirmCodeService from 'src/core/users/services/ConfirmCodeService';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/Logger';

export abstract class ConfirmCodeOperationContract {
    confirmCodeService: ConfirmCodeService;
    logger: Logger
}

export abstract class ConfirmCodeServiceContract {
    httpRequestErrors: HttpRequestErrors;
    usersRepository: UsersRepository;
    logger: Logger
}
