import CreateUserService from 'src/core/services/users/CreateUserService';
import { SchemasUserType } from 'src/schemas';
import SchemaValidator from 'src/infra/helpers/common/SchemaValidator';
import { Logger } from '../../Logger';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import EmailSender from 'src/infra/helpers/user/EmailSender';
import { SecurePasswordHandler } from 'src/infra/helpers/user/SecurePasswordHandler';
import Serializer from 'src/infra/helpers/user/Serializer';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';

export abstract class CreateUserOperationContract {
    usersSchema: SchemasUserType;
    schemaValidator: SchemaValidator;
    createUserService: CreateUserService;
    logger: Logger;
}

export abstract class CreateUserServiceContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    httpRequestErrors: HttpRequestErrors;
    emailSender: EmailSender;
    securePasswordHandler: SecurePasswordHandler;
    serializer: Serializer;
    logger: Logger;
}