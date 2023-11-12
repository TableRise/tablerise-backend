import UpdatePasswordService from 'src/core/users/services/users/UpdatePasswordService';
import { SchemasUserType } from 'src/domains/user/schemas';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import SchemaValidator from 'src/infra/helpers/common/SchemaValidator';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/Logger';

export interface UpdatePasswordOperationContract {
    updatePasswordService: UpdatePasswordService;
    schemaValidator: SchemaValidator;
    usersSchema: SchemasUserType;
    logger: Logger;
}

export interface UpdatePasswordServiceContract {
    usersRepository: UsersRepository;
    logger: Logger;
}

export interface UserPassword {
    user: UserInstance;
    password: string;
}
