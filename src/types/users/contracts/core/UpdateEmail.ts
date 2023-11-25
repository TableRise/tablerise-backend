import UpdateEmailService from 'src/core/users/services/users/UpdateEmailService';
import { SchemasUserType } from 'src/domains/user/schemas';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/Logger';

export interface UpdateEmailOperationContract {
    updateEmailService: UpdateEmailService;
    schemaValidator: SchemaValidator;
    usersSchema: SchemasUserType;
    logger: Logger;
}

export interface UpdateEmailServiceContract {
    usersRepository: UsersRepository;
    httpRequestErrors: HttpRequestErrors;
    logger: Logger;
}

export interface UserEmail {
    user: UserInstance;
    email: string;
}
