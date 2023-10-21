import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/Logger';

export abstract class DeleteUserOperationContract {
    usersRepository: UsersRepository;
    httpRequestErrors: HttpRequestErrors;
    logger: Logger;
}
