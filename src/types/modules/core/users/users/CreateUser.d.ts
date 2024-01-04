import CreateUserService from 'src/core/users/services/users/CreateUserService';
import { SchemasUserType } from 'src/domains/users/schemas';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import { Logger } from '../../../../Logger';
import EmailSender from 'src/domains/users/helpers/EmailSender';
import Serializer from 'src/domains/users/helpers/Serializer';
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
    emailSender: EmailSender;
    serializer: Serializer;
    logger: Logger;
}
