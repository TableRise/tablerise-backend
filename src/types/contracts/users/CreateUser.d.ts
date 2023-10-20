import CreateUserService from 'src/core/services/users/CreateUserService';
import { SchemasUserType } from 'src/schemas';
import SchemaValidator from 'src/infra/helpers/SchemaValidator';
import { Logger } from '../../Logger';
import { MongoModel } from '@tablerise/database-management';
import { User } from 'src/interface/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/infra/helpers/HttpRequestErrors';
import { UserDetail } from 'src/interface/users/schemas/userDetailsValidationSchema';
import EmailSender from 'src/services/user/helpers/EmailSender';

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
    logger: Logger;
}