import CreateUserService from 'src/core/services/users/CreateUserService';
import { SchemasUserType } from 'src/schemas';
import SchemaValidator from 'src/infra/helpers/common/SchemaValidator';
import { Logger } from '../../Logger';
import { MongoModel } from '@tablerise/database-management';
import { User } from 'src/domains/user/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { UserDetail } from 'src/domains/user/schemas/userDetailsValidationSchema';
import EmailSender from 'src/infra/helpers/user/EmailSender';
import { SecurePasswordHandler } from 'src/infra/helpers/user/SecurePasswordHandler';
import Serializer from 'src/infra/helpers/user/Serializer';

export abstract class CreateUserOperationContract {
    usersSchema: SchemasUserType;
    schemaValidator: SchemaValidator;
    createUserService: CreateUserService;
    logger: Logger;
}

export abstract class CreateUserServiceContract {
    usersModel: MongoModel<User>;
    usersDetailsModel: MongoModel<UserDetail>;
    httpRequestErrors: HttpRequestErrors;
    emailSender: EmailSender;
    securePasswordHandler: SecurePasswordHandler;
    serializer: Serializer;
    logger: Logger;
}