import TwoFactorHandler from 'src/domains/common/helpers/TwoFactorHandler';
import StateMachine from 'src/domains/common/StateMachine';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';
import { IUsersSchemas } from 'src/types/modules/interface/users/presentation/users/UsersSchemas';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';

export interface UserToValidateAuthorizationReturn {
    user: UserInstance;
    userDetails: UserDetailInstance;
}

export interface AuthorizationMiddlewareContract {
    schemaValidator: SchemaValidator;
    usersSchemas: IUsersSchemas;
    usersRepository: UsersRepository;
    usersDetailsRepository: UsersDetailsRepository;
    stateMachine: StateMachine;
    twoFactorHandler: TwoFactorHandler;
    logger: Logger;
}
