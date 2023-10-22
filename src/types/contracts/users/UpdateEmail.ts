import UpdateEmailService from 'src/core/users/services/UpdateEmailService';
import { SchemasUserType } from 'src/domains/user/schemas';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import SchemaValidator from 'src/infra/helpers/common/SchemaValidator';
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
