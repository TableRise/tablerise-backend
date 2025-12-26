import TwoFactorHandler from 'src/domains/common/helpers/TwoFactorHandler';
import StateMachine from 'src/domains/common/StateMachine';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/shared/logger';
import { IUsersSchemas } from 'src/types/modules/interface/users/presentation/users/UsersSchemas';
import SchemaValidator from 'src/domains/common/helpers/SchemaValidator';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';

export interface UserToValidateAuthorizationReturn {
    user: User;
    userDetails: UserDetail;
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
