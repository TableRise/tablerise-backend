import { MongoModel } from '@tablerise/database-management';
import { VerifyEmailService } from 'src/core/users/services/VerifyEmailService';
import { User } from 'src/interface/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';
import EmailSender from 'src/services/user/helpers/EmailSender';
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

