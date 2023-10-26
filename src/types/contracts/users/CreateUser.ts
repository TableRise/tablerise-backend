import CreateUserService from 'src/core/users/services/users/CreateUserService';
import { SchemasUserType } from 'src/domains/user/schemas';
import SchemaValidator from 'src/infra/helpers/common/SchemaValidator';
import { Logger } from '../../Logger';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import EmailSender from 'src/infra/helpers/user/EmailSender';
import Serializer from 'src/infra/helpers/user/Serializer';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';

export interface CreateUserOperationContract {
    usersSchema: SchemasUserType;
    schemaValidator: SchemaValidator;
    createUserService: CreateUserService;
    logger: Logger;
}

export interface CreateUserServiceContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    httpRequestErrors: HttpRequestErrors;
    emailSender: EmailSender;
    serializer: Serializer;
    logger: Logger;
}
