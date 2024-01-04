import CompleteUserService from 'src/core/users/services/oauth/CompleteUserService';
import GetUserByIdService from 'src/core/users/services/users/GetUserByIdService';
import { SchemasUserType } from 'src/domains/users/schemas';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/Logger';

export interface CompleteUserOperationContract {
    usersSchema: SchemasUserType;
    completeUserService: CompleteUserService;
    getUserByIdService: GetUserByIdService;
    schemaValidator: SchemaValidator;
    logger: Logger;
}

export interface CompleteUserServiceContract {
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    logger: Logger;
}
