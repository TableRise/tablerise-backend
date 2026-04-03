import UpdateUserService from 'src/core/users/services/users/UpdateUserService';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';

export interface UpdateUserOperationContract {
    schemaValidator: SchemaValidator;
    updateUserService: UpdateUserService;
    logger: Logger;
}

export interface UpdateUserServiceContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
