import UpdateUserService from 'src/core/users/services/UpdateUserService';
import { SchemasUserType } from 'src/domains/user/schemas';
import SchemaValidator from 'src/infra/helpers/common/SchemaValidator';
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
