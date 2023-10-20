import { MongoModel } from '@tablerise/database-management';
import { VerifyEmailService } from 'src/core/users/services/VerifyEmailService';
import { User } from 'src/domains/user/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/infra/helpers/HttpRequestErrors';
import EmailSender from 'src/infra/helpers/EmailSender';
import { Logger } from 'src/types/Logger';

export abstract class VerifyEmailOperationContract {
    verifyEmailService: VerifyEmailService;
    logger: Logger;
}

export abstract class VerifyEmailServiceContract {
    usersModel: MongoModel<User>;
    httpRequestErrors: HttpRequestErrors;
    emailSender: EmailSender;
    logger: Logger;
}

