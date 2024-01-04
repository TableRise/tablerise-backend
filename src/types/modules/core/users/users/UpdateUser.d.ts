import UpdateUserService from 'src/core/users/services/users/UpdateUserService';
import { SchemasUserType } from 'src/domains/users/schemas';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/Logger';

export interface UpdateUserOperationContract {
    schemaValidator: SchemaValidator;
    usersSchema: SchemasUserType;
    updateUserService: UpdateUserService;
    logger: Logger;
}

export interface UpdateUserServiceContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
