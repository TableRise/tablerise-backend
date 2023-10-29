import VerifyEmailService from 'src/core/users/services/users/VerifyEmailService';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import EmailSender from 'src/infra/helpers/user/EmailSender';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/Logger';

export interface VerifyEmailOperationContract {
    verifyEmailService: VerifyEmailService;
    logger: Logger;
}

export interface VerifyEmailServiceContract {
    usersRepository: UsersRepository;
    httpRequestErrors: HttpRequestErrors;
    emailSender: EmailSender;
    logger: Logger;
}
