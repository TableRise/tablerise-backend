import VerifyEmailService from 'src/core/users/services/users/VerifyEmailService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import EmailSender from 'src/domains/users/helpers/EmailSender';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface VerifyEmailOperationContract {
    verifyEmailService: VerifyEmailService;
    schemaValidator: SchemaValidator;
    logger: Logger;
}

export interface VerifyEmailServiceContract {
    usersRepository: UsersRepository;
    httpRequestErrors: HttpRequestErrors;
    emailSender: EmailSender;
    logger: Logger;
}
